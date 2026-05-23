"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "../../components/Header";

export default function ChatRoomPage() {
  const router = useRouter();
  const params = useParams();
  // decode group name (e.g. "Cardiovascular%20Diseases" -> "Cardiovascular Diseases")
  const groupName = decodeURIComponent(params.group);

  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");

  const chatEndRef = useRef(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("username");

    if (!t || !u) {
      router.push("/");
      return;
    }

    setToken(t);
    setUsername(u);

    // Initial fetch
    fetchMessages(t);
    fetchOnlineUsers(t);

    // Polling Intervals
    const messageInterval = setInterval(() => {
      fetchMessages(t);
    }, 2000);

    const onlineInterval = setInterval(() => {
      fetchOnlineUsers(t);
    }, 5000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(onlineInterval);
    };
  }, [groupName, router]);

  useEffect(() => {
    // Scroll to bottom on new messages
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async (authToken) => {
    try {
      const res = await fetch(`http://192.168.39.157:3009/api/chat/messages?communityName=${encodeURIComponent(groupName)}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const fetchOnlineUsers = async (authToken) => {
    try {
      const res = await fetch(`http://192.168.39.157:3009/api/chat/online-users?communityName=${encodeURIComponent(groupName)}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOnlineUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch online list:", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      const res = await fetch("http://192.168.39.157:3009/api/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          communityName: groupName,
          message: messageText
        })
      });

      if (res.ok) {
        setMessageText("");
        // Reload messages immediately
        fetchMessages(token);
      } else {
        alert("Failed to send message.");
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (!token) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <div className="chat-theme" style={{ flex: 1, padding: "10px" }}>
        <div className="wrap">
          {/* Sidebar */}
          <div className="sidebar">
            <h2>Online Users</h2>
            <ul className="online-list">
              {onlineUsers.map((user, idx) => (
                <li key={idx}>
                  <span 
                    style={{
                      display: "inline-block",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#2ecc71",
                      borderRadius: "50%",
                      marginRight: "8px"
                    }}
                  />
                  {user} {user === username && "(You)"}
                </li>
              ))}
            </ul>
          </div>

          {/* Chat Area */}
          <div className="chat-area">
            <div className="chat-header">
              Support Chatroom: {groupName}
            </div>

            <div className="chat-main">
              {messages.map((msg) => {
                const isMe = msg.username === username;
                return (
                  <div key={msg.id} className="msg-row">
                    <div className={`msg ${isMe ? "me" : "other"}`}>
                      <div className="who">{isMe ? "You" : msg.username}</div>
                      <div className="txt">{msg.message}</div>
                      <div className="time">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="chat-input">
              <input
                type="text"
                placeholder="Type your message here..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                required
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
