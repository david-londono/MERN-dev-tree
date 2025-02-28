import { Router } from 'express';
import { createAccount, getUser, login, updateProfile, uploadImage } from './handlers';
import { body } from 'express-validator';
import { handleInputErrors } from './middleware/validation';
import { authenticate } from './middleware/auth';



const router = Router();
// Routing

// user authentication and sign up
router.post('/auth/signup',
    body('handle')
        .notEmpty()
        .withMessage('Handle is required.'),
    body('name')
        .notEmpty()
        .withMessage('Name is required.'),
    body('email')
        .isEmail()
        .withMessage('Email not valid.'),
    body('password')
        .isLength({min: 8})
        .withMessage('Password should be 8 characters at least.'),
    handleInputErrors, //middleware validation errors
    createAccount
) 

// login user
router.post('/auth/login',
    body('email')
        .isEmail()
        .withMessage('Email not valid.'),
    body('password')
        .notEmpty()
        .withMessage('Password is requierd.'),
    handleInputErrors, //middleware validation errors
    login
)

router.get('/user', authenticate, getUser);

router.patch('/user',
    body('handle')
        .notEmpty()
        .withMessage('Handle is required.'),
    body('description')
        .notEmpty()
        .withMessage('Description is required.'),
    handleInputErrors, //middleware validation errors
    authenticate, 
    updateProfile
)

router.post('/image', authenticate, uploadImage)

export default router;