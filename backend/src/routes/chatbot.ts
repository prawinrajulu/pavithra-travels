import { Router, Response } from 'express';
import { chatbotService } from '../services/chatbotService.js';
import { userService } from '../services/userService.js';
import { AuthRequest, authMiddleware, optionalAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// Get or create conversation
router.get('/conversation', optionalAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    let userId = req.query.userId as string;

    if (req.user) {
      const user = await userService.getUserByFirebaseUid(req.user.uid);
      if (user) {
        userId = user.id;
      }
    }

    if (!userId) {
      return next(new AppError(400, 'User ID is required'));
    }

    const conversationId = req.query.conversationId as string;
    let conversation;

    if (conversationId) {
      conversation = await chatbotService.getConversation(conversationId);
      if (!conversation) {
        return next(new AppError(404, 'Conversation not found'));
      }
    } else {
      conversation = await chatbotService.createConversation(userId);
    }

    res.json({
      success: true,
      conversation,
    });
  } catch (error) {
    next(error);
  }
});

// Get user conversations
router.get('/conversations', authMiddleware, async (req: AuthRequest, res: Response, next) => {
  try {
    if (!req.user) {
      return next(new AppError(401, 'User not authenticated'));
    }

    const user = await userService.getUserByFirebaseUid(req.user.uid);

    if (!user) {
      return next(new AppError(404, 'User not found'));
    }

    const conversations = await chatbotService.getUserConversations(user.id);

    res.json({
      success: true,
      conversations,
    });
  } catch (error) {
    next(error);
  }
});

// Send message
router.post('/message', optionalAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { message, conversationId, userId } = req.body;

    if (!message) {
      return next(new AppError(400, 'Message is required'));
    }

    let finalUserId = userId;

    if (req.user && !finalUserId) {
      const user = await userService.getUserByFirebaseUid(req.user.uid);
      if (user) {
        finalUserId = user.id;
      }
    }

    if (!finalUserId) {
      return next(new AppError(400, 'User ID is required'));
    }

    // Generate chatbot response
    const botResponse = await chatbotService.generateChatbotResponse(message);

    // Save message
    const response = await chatbotService.saveMessage(
      finalUserId,
      conversationId || 'default',
      message,
      botResponse,
    );

    res.json({
      success: true,
      response,
    });
  } catch (error) {
    next(error);
  }
});

// Archive conversation
router.post('/conversation/:conversationId/archive', authMiddleware, async (req: AuthRequest, res: Response, next) => {
  try {
    if (!req.user) {
      return next(new AppError(401, 'User not authenticated'));
    }

    const { conversationId } = req.params;
    const conversation = await chatbotService.archiveConversation(conversationId);

    res.json({
      success: true,
      conversation,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
