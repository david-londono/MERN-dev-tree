import User from "../models/User";
import {Request, Response} from 'express';
import colors from 'colors'
import { checkPassword, hashPassword } from "../utils/auth";
import slug from 'slug';
import { generateJWT } from "../utils/jwt";
import formidable from 'formidable';
import cloudinaryConfig  from '../config/cloudinary';
import { v4 as uuid} from "uuid";



export const createAccount = async (req: Request, res: Response) => {
    // Data Validations
    const { email, password, handle } = req.body;
    const userExist = await User.findOne({email});
    const hanldeExist = await User.findOne({handle});

    if (userExist) {
        const error = new Error('email is already registered');
        res.status(409).json({error: error.message});
        return;
    }

    if (hanldeExist) {
        const error = new Error('handle is already exist');
        res.status(409).json({error: error.message});
        return;
    }

    // Create User in Database if validation pass 
    const user = new User(req.body);
    user.password = await hashPassword(password);
    user.handle = slug(handle, '_');
    await user.save();
    res.status(201).send('registro creado correctamente');
};

export const login = async (req: Request, res: Response) => {
    // Data Validations
    const { email, password } = req.body;
    const user = await User.findOne({email});

    if (!user) {
        const error = new Error('User not Exist');
        res.status(404).json({error: error.message});
        return;
    }

    // check password
    const passwordMatchs = await checkPassword(password, user.password);

    if (!passwordMatchs) {
        const error = new Error('Invalid Password')
        res.status(401).json({error: error.message});
        return;
    }

    const token = generateJWT({id: user._id});
    
    res.status(200).send(token);
};

export const getUser = async (req: Request, res: Response) => {
   res.json(req.user);
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { description, links } = req.body;
        const handle = slug(req.body.handle, '_');
        if (handle !== req.user.handle) {
            const handleExist = await User.findOne({handle})
            if (handleExist && handleExist.email !== req.user.email) {
                const error = new Error('Handle already exist');
                res.status(409).json({error: error.message});
                return;
            }
        }
        req.user.description = description;
        req.user.handle = handle;
        req.user.links = links;
        await req.user.save();
        res.send('Perfil actualizado correctamente');


    } catch (err) {;
        const error = new Error('Hubo un error al actualizar el perfil');
        res.status(500).json({error: error.message});
        
    }
}

export const uploadImage = async (req: Request, res: Response) => {
    const form = formidable({multiples: false});
    
    try {
        form.parse(req, (err, fields, files) => {
            cloudinaryConfig.uploader.upload(files.file[0].filepath,{public_id: uuid()}, async (error, result) => {
                if (error) {
                    const error = new Error('Hubo un error al subir la imagen');
                    res.status(500).json({error: error.message});
                    return;
                }
                if (result) {
                    const user = req.user;
                    user.image = result.secure_url
                    await user.save();
                    res.json({image: result.secure_url});
                }
            })
        });

    } catch (error) {
        res.status(500).json({error: error.message});
    }   
}