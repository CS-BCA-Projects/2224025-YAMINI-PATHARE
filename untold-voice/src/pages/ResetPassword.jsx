import { useState } from "react";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleResetPassword = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/auth/reset-password/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newPassword }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                console.error("❌ Error:", data.message);
                alert(data.message);  // Show the error message
                return;
            }
    
            alert("✅ Password successfully reset!");
        } catch (error) {
            console.error("❌ Network Error:", error);
            alert("Something went wrong. Please try again.");
        }
    };
    

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleResetPassword}>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default ResetPassword;
