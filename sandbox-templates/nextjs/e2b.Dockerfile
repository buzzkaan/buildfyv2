FROM node:21-slim

# Install curl
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh

# Install dependencies and customize sandbox
WORKDIR /home/user/nextjs-app

RUN npx --yes create-next-app@15.3.3 . --yes

RUN npx --yes shadcn@2.6.3 init --yes -b neutral --force
RUN npx --yes shadcn@2.6.3 add --all --yes

# Copy edit mode script
COPY edit-mode.js /home/user/nextjs-app/public/edit-mode.js

# Add edit mode script to layout (inject <head> with script before <body>)
RUN sed -i 's|<body|<head>\n      <script src="/edit-mode.js"></script>\n    </head>\n    <body|' /home/user/nextjs-app/app/layout.tsx

# Move the Nextjs app to the home directory and remove the nextjs-app directory
RUN mv /home/user/nextjs-app/* /home/user/ && rm -rf /home/user/nextjs-app