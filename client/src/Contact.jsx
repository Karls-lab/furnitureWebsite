import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Contact() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  return (
    <div className="mt-10 flex items-center justify-center flex-col">
        <h2 className="text-3xl font-bold mb-8 text-white">Contact Us</h2>
        <h3 className="text-2xl font-bold mb-8 text-white">123-456-7899</h3>
        <h3 className="text-2xl font-bold mb-8 text-white">
            <a href="mailto:john_doe@example.com">john_doe@example.com</a>
        </h3>

    </div>
  );
}

export default Contact;