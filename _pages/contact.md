---
layout: single
title: "Contact"
permalink: /contact/
author_profile: true
---

<style>
.page__title {
    display: none !important;
}

.contact-form {
    max-width: 500px;
    margin: 20px 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    color: #333;
    font-size: 14px;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e1e5e9;
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    background-color: #fff;
    box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #007cba;
    box-shadow: 0 0 0 3px rgba(0, 124, 186, 0.1);
}

.form-group textarea {
    resize: vertical;
    min-height: 120px;
    line-height: 1.5;
}

.submit-btn {
    background: linear-gradient(135deg, #007cba 0%, #005a87 100%);
    color: white;
    padding: 12px 30px;
    border: none;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 124, 186, 0.2);
}

.submit-btn:hover {
    background: linear-gradient(135deg, #005a87 0%, #004466 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 124, 186, 0.3);
}

.submit-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 124, 186, 0.2);
}

.form-description {
    margin-bottom: 25px;
    color: #666;
    font-size: 15px;
    line-height: 1.4;
}
</style>

I'm always happy to connect with colleagues, students, and collaborators. Please feel free to reach out using the information below or by filling out the contact form below.

**Email**: [khanis@bc.edu](mailto:khanis@bc.edu)

**Google Scholar**: [View Profile](https://scholar.google.com/citations?view_op=list_works&hl=en&hl=en&user=KOvMEfIAAAAJ)

**LinkedIn**: [Connect with me](https://www.linkedin.com/in/saber-khani-99825722a)

---

## Contact Form

<div class="contact-form">
    <p class="form-description">
    </p>
    
    <form action="https://formspree.io/f/xeozakdn" method="POST">
        <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" name="name" required placeholder="Enter your full name">
        </div>
        
        <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" required placeholder="Enter your email address">
        </div>
        
        <div class="form-group">
            <label for="subject">Subject</label>
            <input type="text" id="subject" name="subject" placeholder="Brief subject line (optional)">
        </div>
        
        <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" required placeholder="Tell me about your question, research interest, or collaboration idea..."></textarea>
        </div>
        
        <button type="submit" class="submit-btn">Send Message</button>
    </form>
</div>
