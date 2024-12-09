# PDFfy AI - README

## 📚 Introduction  
**PDFfy AI** is a powerful SaaS application designed to simplify note-taking and question-answering directly from your PDFs. With this app, users can upload PDFs, take notes, and even generate AI-powered answers for selected text, all in a seamless interface. Whether you’re studying, researching, or organizing your thoughts, PDFfy AI is here to make your workflow smarter and more efficient.  

---

## ✨ Features of the Application  

1. **Secure Authentication**  
   - Users log in and manage their accounts securely with Clerk.  

2. **PDF Upload and Management**  
   - Upload PDFs (up to 1 MB and 1 page).  
   - View all your uploaded PDFs conveniently.  
   - Free accounts can upload up to 5 PDFs.  

3. **Note-Taking Interface**  
   - Write, save, and format notes with options like:  
     - **Bold**  
     - *Italic*  
     - `Code`  

4. **AI-Powered Answers**  
   - Select a question within the PDF content.  
   - Generate precise answers using AI based on the uploaded PDF content.  

5. **Premium Features**  
   - Upgrade to a premium account for Rs. 10,000.  
   - Unlock unlimited PDF uploads.  

6. **Streamlined Payment**  
   - Upgrade accounts securely via Razorpay.  

---

## 🛠️ Technologies Used  

- **Next.js**: Frontend framework for building the application.  
- **TailwindCSS**: For styling and responsive design.  
- **Shadcn UI**: Component library for polished user interfaces.  
- **Clerk**: Authentication system for user management.  
- **Convex Database**: Storage solution for user details, PDFs, and vector embeddings.  
- **Google Gemini API**:  
  - Generates vector embeddings for PDF content.  
  - Provides AI-generated responses based on selected text.  
- **TipTap Editor**: Rich text editor for writing and formatting notes.  
- **LangChain**: Orchestrates the AI workflows for generating accurate answers.  
- **Razorpay**: Handles payments for premium account upgrades.  
