#source for the base image
FROM busybox:1.35

#ENV variable for use when the site is running or during build
ENV SITE_VERSION 1.1.2
# Create a non-root user to own the files and run our server
RUN adduser -D static

#Switch user context
USER static

VOLUME /home/static website_data
#set a work directory
WORKDIR /home/static

# Copy the static website
# Use the .dockerignore file to control what ends up inside the image!
COPY / .

#Exposes the port to the outside world
EXPOSE 8080
# Run BusyBox httpd
CMD ["busybox", "httpd", "-f", "-v", "-p", "8080"]