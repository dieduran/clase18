import mongoose from 'mongoose';
 
const User = mongoose.model('Users',{
    username: String,
    password: String,
    name: String,
    address: String,
    phone: String,
    avatar: String
});

export { User }

