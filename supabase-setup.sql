-- Example: Add your first project
INSERT INTO public.projects ("Title", "Description", "Img", "Link", "Github", "Features", "TechStack") 
VALUES (
    'Your Project Title', 
    'A detailed description of your project, explaining its main purpose and goals.', 
    'https://your-image-url.com/project-image.png', 
    'https://your-live-demo.com', 
    'https://github.com/yourusername/your-repo', 
    '["Feature 1", "Feature 2", "Feature 3"]', 
    '["React", "Tailwind CSS", "Node.js"]'
);

-- Example: Add your first certificate
INSERT INTO public.certificates ("Img") 
VALUES ('https://your-image-url.com/certificate.png');

-- Example: Add a pinned comment (optional)
INSERT INTO public.portfolio_comments (content, user_name, is_pinned) 
VALUES ('Welcome to my portfolio! Feel free to leave a comment.', 'YourName', true);






