import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import * as userController from '../controllers/user.controller';
import { Routes } from '../constants/routes';
import verifyTokenMiddleware from '../middlewares/verifyTokenMiddleware';
import { upload } from '../config/multer';

const router = Router();

router.post(Routes.USER_REGISTER, authController.register);

router.post(Routes.USER_LOGIN, authController.login);

router.post(Routes.USER_LOGOUT, authController.logout);

router.get(Routes.USER_DASHBOARD,verifyTokenMiddleware, userController.getDashboard);

router.get(Routes.USER_PROFILE,verifyTokenMiddleware, userController.getProfile);

router.post(Routes.UPLOAD_IMAGE,upload.single("image"),verifyTokenMiddleware, userController.uploadImageKYC);

router.post(Routes.UPLOAD_VIDEO,upload.single("video"),verifyTokenMiddleware, userController.uploadVideoKYC);

export default router;
