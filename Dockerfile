FROM ghost:3.40.5

WORKDIR /var/lib/ghost

#install the google cloud storage adapter
RUN npm install ghost-v3-google-cloud-storage --no-save \
    && mkdir -p ./content/adapters/storage \
    && cp -vr ./node_modules/ghost-v3-google-cloud-storage ./content/adapters/storage/gcs