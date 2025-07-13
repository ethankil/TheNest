import { db } from "../firebase";
import { collection, addDoc, getDoc, doc, serverTimestamp } from "firebase/firestore";


/**
* Submits a report to firestore, includes postID, category/message, and users email.
*/


export const submitReport = async (postID, category, message, email, reportedEmail) => {
   const postRef = doc(db, "posts", postID);
   const postSnapshot = await getDoc(postRef);


   let postData = null;
   if (postSnapshot.exists()) {
       const data = postSnapshot.data();
       postData = {
           title: data.title || "",
           description: data.description || "",
           tag: data.tag || "",
           userEmail: data.userEmail || "",
           post_id: postID,
       };
   }


   await addDoc(collection(db, "reports"), {
       post_id: postID,
       category,
       message: message || "",
       report_by: email,
       reported_user: reportedEmail,
       status: "pending",
       created_at: serverTimestamp(),
       ...postData && { post_snapshot:postData }
   });
};
