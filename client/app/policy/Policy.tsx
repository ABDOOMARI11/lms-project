import React from "react";
import { styles } from "../styles/style";

type Props = {};

const Policy = (props: Props) => {
  return (
    <div>
      <div className={"w-[95%] 800px:w-[92%] m-auto py-2 text-black dark:text-white px-3 dark:bg-slate-700"}>
        <h1 className={`${styles.title} !text-start pt-2 `}>
          Platform Terms and Conditions
        </h1>
        <div className="py-2 text-[18px] font-Poppins leading-8 whitespace-pre-line">
          <br />
          <h2 className="font-bold text-center">Introduction</h2>
          <br />
          <p>
            Welcome to <strong>DAcademy</strong>, a dedicated space for students who are passionate about diagnostics and eager to advance their knowledge through our specialized courses. These Terms and Conditions are designed to ensure a positive and productive experience for all users. By accessing or using our services, you agree to comply with these terms, which govern your use of our platform, course purchases, premium support, and certification processes.
          </p>
          <br />
          <h2 className="font-bold text-center">Eligibility</h2>
          <br />
          <p>
            To participate in our courses, you must be a registered student on our platform. Registration requires providing accurate personal information and creating a secure account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. If you suspect any unauthorized use of your account, you must notify us immediately.
          </p>
          <br />
          <h2 className="font-bold text-center">Course Purchase and Access</h2>
          <br />
          <p>
            When you purchase a course, you gain access to high-quality materials, including video lectures, reading materials, and practical exercises. Access to these materials is granted for a period specified at the time of purchase, typically ranging from six months to a year. Our courses are designed to be flexible, allowing you to learn at your own pace within the access period. Upon expiration, access to the course content will be revoked unless renewed.
          </p>
          <br />
          <h2 className="font-bold text-center">Premium Support</h2>
          <br />
          <p>
            We offer premium support to students who purchase our courses. Premium support includes priority assistance from our expert tutors, access to exclusive webinars, and a dedicated support channel for troubleshooting and guidance. Our support team is available during business hours, Monday through Friday, from 9 AM to 6 PM (local time). We strive to respond to all inquiries within 24 hours.
          </p>
          <br />
          <h2 className="font-bold text-center">Certification</h2>
          <br />
          <p>
            Upon successful completion of a course, you may be eligible for a certification that recognizes your achievement. Certification requirements vary by course and typically include completing all modules, passing quizzes and exams, and participating in practical assessments. Certifications are issued digitally and can be shared on professional networks such as LinkedIn. They serve as a testament to your dedication and expertise in the field of diagnostics.
          </p>
          <br />
          <h2 className="font-bold text-center">Refund Policy</h2>
          <br />
          <p>
            We understand that circumstances may change, and you may need to request a refund. Our refund policy allows for requests to be made within 14 days of purchase, provided that you have not accessed more than 20% of the course content. Refunds are processed within 7-10 business days of approval. Please note that administrative fees may apply. For a detailed overview of our refund policy, please visit our Refund Policy page.
          </p>
          <br />
          <h2 className="font-bold text-center">Code of Conduct</h2>
          <br />
          <p>
            We are committed to fostering a respectful and inclusive learning environment. All students are expected to adhere to our Code of Conduct, which prohibits harassment, discrimination, and disruptive behavior. Violations of the Code of Conduct may result in warnings, suspension, or permanent termination of access to our platform. We encourage all users to report any inappropriate behavior to our support team.
          </p>
          <br />
          <h2 className="font-bold text-center">Intellectual Property</h2>
          <br />
          <p>
            All content provided on our platform, including but not limited to course materials, videos, texts, graphics, and software, is the intellectual property of our platform and is protected by copyright laws. You are granted a limited license to access and use the content for personal, non-commercial purposes only. Any unauthorized use, reproduction, or distribution of the content is strictly prohibited and may result in legal action.
          </p>
          <br />
          <h2 className="font-bold text-center">Changes to Terms and Conditions</h2>
          <br />
          <p>
            We reserve the right to modify these Terms and Conditions at any time. Any changes will be posted on this page, and the revised terms will take effect immediately upon posting. It is your responsibility to review these terms regularly. Continued use of our platform after any such changes constitutes your acceptance of the new terms.
          </p>
          <br />
          <h2 className="font-bold text-center">Contact Information</h2>
          <br />
          <p>
            If you have any questions or concerns regarding these Terms and Conditions, or if you need assistance with any aspect of our services, please do not hesitate to contact us.
            You can reach our support team at  <strong> <u className="text-orange-500"> <span className="text-orange-500">dacademy.sup1@gmail.com.</span> </u></strong> We are here to help you and ensure that your experience on our platform is both rewarding and enjoyable.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Policy;
