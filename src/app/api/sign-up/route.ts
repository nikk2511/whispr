import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await dbConnect();
  } catch (error) {
    console.error('Database connection failed:', error);
    return Response.json(
      {
        success: false,
        message: 'Database connection failed. Please try again later.',
      },
      { status: 500 }
    );
  }

  try {
    const { username, email, password } = await request.json();

    // Basic validation
    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          message: 'Username, email, and password are required.',
        },
        { status: 400 }
      );
    }

    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail) {
      return Response.json(
        {
          success: false,
          message: 'User already exists with this email',
        },
        { status: 400 }
      );
    }

    // Create new user - no verification needed
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      verifyCode: '000000', // Dummy code since verification is disabled
      verifyCodeExpiry: new Date(Date.now() + 3600000), // Dummy expiry
      isVerified: true, // Set as verified immediately
      isAcceptingMessages: true,
      messages: [],
    });

    await newUser.save();

    return Response.json(
      {
        success: true,
        message: 'Account created successfully. You can now sign in.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('E11000')) {
        return Response.json(
          {
            success: false,
            message: 'Username or email already exists.',
          },
          { status: 400 }
        );
      }
    }
    
    return Response.json(
      {
        success: false,
        message: 'Internal server error. Please try again later.',
      },
      { status: 500 }
    );
  }
}