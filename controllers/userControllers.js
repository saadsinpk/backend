const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
var CryptoJS = require("crypto-js");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const Auth = require("../Modelss/userModel");
const UserVerify = require("../Modelss/UserVerify");
const { fast2sms } = require("./../utils/otp.util");
var Mailgen = require('mailgen');


const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    phone: { type: Number, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default: "uploads/profiles/profile.png",
    },
    user: { type: String },
    isAdmin: { type: Boolean, default: false },
    verified: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }
});
const User = mongoose.model("Auth", userSchema);


var mailTransport = () =>
  nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false,
    auth: {
      user: "50edd658715806",
      pass: "1a254a5bf1934b",
    },
  },);

// const generateEmailTemplate = (code) => {
//   return `
//    <!DOCTYPE html>
//   <html lang="en">
//   <head>
//       <meta charset="UTF-8">
//       <meta http-equiv="X-UA-Compatible" content="IE=edge">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Document</title>
//       <style>
//       @media only screen and (max-width: 620px) {
//         h1 {
//           font-size: 20px;
//           padding: 5px;
//         }
//       }
//       </style>
//   </head>
//   <body>
//       <div>
//       <div style="max-width: 620px; margin: 0 auto; font-family: sans-serif; color: #272727;">
//       <h1 style="background: #f6f6f6; padding: 10px; text-align: center; color: #272727">We are delighted to welcome you to our team!</h1>
//       <p>Please Verify Your Email To Continue Your Verification code is:</p>
//       <p style="width: 80px; margin: 0 auto; font-weight: bold; text-align: center; background: #f6f6f6; border-radius: 5px;
//       font-size: 25px;">${code}</p>
//       </div>
//       </div>
//   </body>
//   </html>
//       `;
// };






async function sendEmail() {
  try {
    const transporter = mailTransport();
    const mailOptions = {
      from: "bobbycayley@gmail.com",
      to: "hammad.sidtecno@gmail.com",
      subject: "Test Email",
      text: "This is a test email sent using Node.js and Nodemailer!",
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!", info);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
require('dotenv').config();
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const bucketname = "real-state-store"
const region = "us-east-1"
const accessKeyId = "AKIARAO4RR33DHF2OYHX"
const secretAccessKey = "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"

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

async function uploadFile(file) {
  const fileStream = fs.createReadStream(file);
  const uploadParams = {
    Bucket: bucketname,
    Body: fileStream,
    Key: file,
  };
  const command = new PutObjectCommand(uploadParams);
  try {
    const response = await s3.send(command);
    console.log("File uploaded successfully:", response);
    const s3BucketUrl = `https://${bucketname}.s3.amazonaws.com/`;
    const fileKey = file;
    const s3ObjectUrl = s3BucketUrl + encodeURIComponent(fileKey);
    return s3ObjectUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, user } = req.body;
  console.log(req.body)
  const piss = await uploadFile(req.body.pic)

  if (!name || !email || !password) {
    res.status(200).json({
      Msg: "Please Fil Out All Fields",
    });
  }

  const userExists = await Auth.findOne({ email });

  if (userExists) {
    res.status(200).json({
      Msg: "This User Is Already Exits",
    });
  }

  let pic = req.body.pic;
  if (pic === "undefined" || pic === "") {
    pic = "uploads/profiles/profile.png";
  }

  const newAuth = new Auth({
    name,
    email,
    password: CryptoJS.AES.encrypt(password, "secret key 123").toString(),
    pic,
    user,
  },);

  let OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  },);

  const userVerify = new UserVerify({
    owner: newAuth._id,
    code: OTP,
    password: CryptoJS.AES.encrypt(password, "secret key 123").toString(),
    email: newAuth.email,
    pic: piss,
    user: newAuth.user
  },);
  console.log(OTP, newAuth.email)
 
  try {
    await userVerify.save();
    // console.log(userVerify)
    if (email.indexOf("@") === -1) {
      console.log('aaaa', newAuth.email)
      await fast2sms({
        message: `Your OTP is ${OTP}`,
        contactNumber: newAuth.email,
      });
    } else {
         var mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                // Appears in header & footer of e-mails
                name: 'Mailgen',
                link: 'https://mailgen.js/'
                // Optional product logo
                // logo: 'https://mailgen.js/img/logo.png'
            }
        });
        let response = {
            body: {
                name: `${name}`,
                intro: 'Welcome to Mailgen! We\'re very excited to have you on board.',
                table: {
                    data: [
                        {
                            item: "Nodemailer stack book",
                            description: "a backend app"
                        }
                    ],
                },
                outro: ` Your code is  ${OTP}`
            },
        }
        var emailBody = mailGenerator.generate(response);
        var emailText = mailGenerator.generatePlaintext(response);
  // var emailBody = mailGenerator.generate(emailMail);

      let config = {
        service: "gmail",
        auth: {
            user: "hafeez122.sidtechno@gmail.com",
            pass: "bscsfeknxiewezkm"
        }
    }
    
    // let email1= "hafeez122.sidtechno@gmail.com"
      const transporter = nodemailer.createTransport(config);
    
      let message = {
        from: "hafeez122.sidtechno@gmail.com", // sender address
        to: `${email},hafeez122.sidtechno@gmail.com`, // list of receivers
        subject: "Hello This is your code", // Subject line
        text: emailText, 
        // html: "<b>Hello world?</b>", // html body
    }
    
      const info = await transporter.sendMail(message).then( (succ) =>{
        console.log(succ)
      })
      .catch( (err) =>{
        console.log(err)
      })
    
  
      // mailTransport().sendMail({
      //   from: "29b74381ea-28e27b@inbox.mailtrap.io",
      //   to: newAuth.email,
      //   subject: "Verify you remail account",
      //   html: generateEmailTemplate(OTP),

      // });
    }

    res.json({
      success: true,
      user: {
        name: newAuth.name,
        email: newAuth.email,
        id: newAuth._id,
        verified: newAuth.verified,
      },
    });
  } catch (err) {
    res.status(404).json(err);
  }
});

const registerVerify = asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    res.status(400).json({
      Msg: "Please Fil Out Code Field",
    });
  }

  const verify = await UserVerify.findOne({ owner: req.params.id, code: code });

  if (verify) {
    await Auth.findByIdAndUpdate(verify.id, { verified: true });
    await Auth.findById(verify.id).then((user) => {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        password: user.password,
        email: user.email,
        pic: user.pic,
        user: user.user,
        isAdmin: user.isAdmin,
        verified: user.verified,
        token: generateToken(res._id),
        Msg: "register",
      });
    });
  } else {
    res.status(200).json({ Msg: "Wrong Verification Code" });
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password, isAdmin } = req.body;

  const user = await User.findOne({ email, isAdmin });
  if (user) {
    const bytes = CryptoJS.AES.decrypt(user.password, "secret key 123");
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
    if (originalPassword == password && isAdmin == user.isAdmin) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
        user: user.user,
        Msg: "login",
      });
    } else {
      res.status(200).json({
        Msg: "Wrong Password",
      });
    }
  } else {
    res.status(200).json({
      Msg: "Email not found",
    });
  }
});
const authUser2 = asyncHandler(async (req, res) => {
  const { email, password, isAdmin } = req.body;

  const user = await Auth.findOne({ email });
  if (user) {
    const bytes = CryptoJS.AES.decrypt(user.password, "secret key 123");
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
    if (originalPassword == password) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
        user: user.user,
        Msg: "login",
      });
    } else {
      res.status(200).json({
        Msg: "Wrong Password",
      });
    }
  } else {
    res.status(200).json({
      Msg: "Email not found",
    });
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ],
    }
    : {};

  const users = await await Auth.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  res.send(users);
});

module.exports = {
  registerUser,
  authUser,
  allUsers,
  registerVerify,
  authUser2
};
