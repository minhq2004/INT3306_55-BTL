HTMl code de test file Upload

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Posts</title>
  <style>
    .post {
      border: 1px solid #ddd;
      padding: 16px;
      margin-bottom: 20px;
      border-radius: 8px;
    }
    .post h2 {
      font-size: 24px;
      color: #333;
    }
    .post .content {
      margin: 10px 0;
    }
    .post .files img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
    }
  </style>
</head>
<body>

  <div id="posts-container"></div>

  <script>
    async function getPosts() {
      try {
        const response = await fetch('http://localhost:3000/api/public/posts'); // URL của API
        const posts = await response.json();

        const postsContainer = document.getElementById('posts-container');
        posts.forEach(post => {
          const postElement = document.createElement('div');
          postElement.classList.add('post');

          const titleElement = document.createElement('h2');
          titleElement.textContent = post.title;
          postElement.appendChild(titleElement);

          const contentElement = document.createElement('div');
          contentElement.classList.add('content');
          contentElement.textContent = post.content;
          postElement.appendChild(contentElement);

          if (post.files && post.files.length > 0) {
            const filesElement = document.createElement('div');
            filesElement.classList.add('files');

            post.files.forEach(file => {
              if (file.file_type.startsWith('image')) {
                const imgElement = document.createElement('img');
                imgElement.src = `http://localhost:3000/public/${file.file_path}`; // URL đầy đủ để hiển thị ảnh
                filesElement.appendChild(imgElement);
              } else if (file.file_type === 'application/pdf') {
                const pdfElement = document.createElement('a');
                pdfElement.href = `http://localhost:3000/public/${file.file_path}`;
                pdfElement.textContent = file.file_name;
                filesElement.appendChild(pdfElement);
              }
            });

            postElement.appendChild(filesElement);
          }

          postsContainer.appendChild(postElement);
        });
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }

    getPosts();
  </script>
</body>
</html>
