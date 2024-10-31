import React, { useState } from 'react';
import './Comments.css';

const CommentBox = () => {
  // Initialize with some sample comments
  const [comments, setComments] = useState([
    { username: 'User1', text: "This is the first comment!" },
    { username: 'User2', text: "Here's another comment." },
    { username: 'User3', text: "Great post, thank you for sharing!" }
  ]);
  const [newComment, setNewComment] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    //locgic backend here
    e.preventDefault();
    if (newComment.trim() !== '' && username.trim() !== '') {  
      setComments([...comments, { username, text: newComment }]);
      setNewComment('');
      setUsername('');
    }
  };

  return (
    <div className="comment-box">
      <div className="comment-navigator">
        <div className="commentbox-nav-box">Comments ({comments.length})</div>
      </div>
      <div className="comment-section">
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <strong>{comment.username}:</strong> <p>{comment.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}> 
        <input
          type="text" //logic backend here
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your name"
        />
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment here..."
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CommentBox;
