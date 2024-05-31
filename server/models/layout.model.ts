import mongoose, { Document, Model, Schema } from "mongoose";

interface FaqItem extends Document {
  question: string;
  answer: string;
}
interface Category extends Document {
  title: string;
}

interface BannerImage extends Document {
  public_id: string;
  url: string;
}

interface ILayout extends Document {
  type: string;
  FAQ?: FaqItem[];
  categories: Category[];
  Banner: {
    image: BannerImage;
    title: string;
    subTitle: string;
  };
}

const faqSchema = new Schema<FaqItem>({
  question: { type: String },
  answer: { type: String },
});

const categorySchema = new Schema<Category>({
  title: { type: String },
});
const bannerImageSchema = new Schema<BannerImage>({
  public_id: { type: String },
  url: { type: String },
});

const layoutSchema = new Schema<ILayout>({
  type: { type: String },
  FAQ: [faqSchema],
  categories: [categorySchema],
  Banner: {
    image: bannerImageSchema,
    title: { type: String },
    subTitle: { type: String },
  },
});
const layoutModel: Model<ILayout> = mongoose.model("layout", layoutSchema);
export default layoutModel;
