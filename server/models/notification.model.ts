import mongoose, { Document, Model, Schema } from "mongoose";

export interface INotification extends Document {
  title: string;
  message: string;
  status: string;
  userId: string;
}

const  notificatSchema = new  Schema<INotification> ({
     title:{
        type:String,
      //   required:true
     },
     message:{
        type:String,
        required:true
     },
     status:{
        type:String,
        required:true,
        default:"unread"
     },


},{timestamps:true});
 const notificatModel : Model<INotification> = mongoose.model("Notifications",notificatSchema);
 export default notificatModel;