# Make sure Cloud Run and Storage Apis are enabled. 
# https://support.google.com/googleapi/answer/6158841?hl=en
# docker build -t CONTAINER_NAME .
# docker tag CONTAINER_NAME gcr.io/GCS_PROJECT_NAME/CONTAINER_NAME
# docker push gcr.io/GCS_PROJECT_NAME/CONTAINER_NAME
# In Cloud Run, create new service and choose CONTAINER_NAME image
# example
# https://cloud.google.com/run/docs/quickstarts/build-and-deploy
# docker build -t ghost-static .
# docker tag ghost-static gcr.io/ghost-firebase/ghost-static
# docker push gcr.io/ghost-firebase/ghost-static
FROM ghost:3.40.5

WORKDIR /var/lib/ghost

#install the google cloud storage adapter
RUN npm install ghost-v3-google-cloud-storage --no-save \
    && mkdir -p ./content/adapters/storage \
    && cp -vr ./node_modules/ghost-v3-google-cloud-storage ./content/adapters/storage/gcs