pipeline {
    agent any

    environment {
        ACR_NAME = "fullstackproshop"   // 🔁 CHANGE THIS
        IMAGE_NAME = "proshop-app"
        RESOURCE_GROUP = "fullstackproshop-rg"  // 🔁 CHANGE THIS
        ACI_NAME = "proshop-aci"
        LOCATION = "eastus"
    }

    stages {

        stage('Clone Repo') {
            steps {
              git branch: 'main',      
                git 'git@github.com:nirmal-debug995/proshohfullstack.git'
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Move Frontend Build to Backend') {
            steps {
                sh 'rm -rf backend/frontend'
                sh 'mkdir -p backend/frontend'
                sh 'cp -r frontend/build backend/frontend/'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $ACR_NAME.azurecr.io/$IMAGE_NAME:latest -f backend/Dockerfile .'
            }
        }

        stage('Login to ACR') {
            steps {
                sh 'az acr login --name $ACR_NAME'
            }
        }

        stage('Push Image to ACR') {
            steps {
                sh 'docker push $ACR_NAME.azurecr.io/$IMAGE_NAME:latest'
            }
        }

        stage('Deploy to ACI') {
            steps {
                sh '''
                az container delete \
                  --name $ACI_NAME \
                  --resource-group $RESOURCE_GROUP \
                  --yes || true

                az container create \
                  --resource-group $RESOURCE_GROUP \
                  --name $ACI_NAME \
                  --image $ACR_NAME.azurecr.io/$IMAGE_NAME:latest \
                  --cpu 1 \
                  --memory 1.5 \
                  --ports 5000 \
                  --ip-address Public \
                  --registry-login-server $ACR_NAME.azurecr.io \
                  --registry-username $(az acr credential show --name $ACR_NAME --query username -o tsv) \
                  --registry-password $(az acr credential show --name $ACR_NAME --query passwords[0].value -o tsv)
                '''
            }
        }
    }
}
