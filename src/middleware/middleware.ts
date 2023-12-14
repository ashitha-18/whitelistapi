import { Request, Response, NextFunction } from 'express';


const whitelistedEmails = ['latest@gmail.com', 'new@gmail.com', 'middlewarechecking@gmail.com'];

export const whitelistMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const email =  req.params.email || req.body.email;
    console.log('Request object:', email);

    console.log('condition', whitelistedEmails.includes(email));

    if (whitelistedEmails.includes(email)) {
      console.log(`Authorized email: ${email}`);
      next();
    } else {
      console.log(`Unauthorized email: ${email}`);
      res.status(403).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    console.error(`Error in whitelistMiddleware: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
