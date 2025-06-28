import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Submits a report to firestore, includes postID, category/message, and users email.
 */

export async function submitReport(postID, category, message, email) {

    if (!postID || !category) throw new Error ("Missing required fields");
    if (category == "Other" && !message?.trim()) {
        throw new Error("Message required for 'Other'");
    }

    const report = {
        post_id: postID,
        category,
        message: message || "",
        report_by: email,
        status: "pending",
        created_at: serverTimestamp(),
    };

    await addDoc(collection(db, "reports"), report);
}