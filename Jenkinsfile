pipeline {
    agent any

    environment {
        ACR_NAME = "fullstackproshop"
        ACR_LOGIN_SERVER = "fullstackproshop.azurecr.io"
        IMAGE_NAME = "proshop-app"
        RESOURCE_GROUP = "fullstackproshop-rg"
        ACI_NAME = "proshop-aci"
        LOCATION = "eastus"
    }

    stages {

        stage('Checkout Repo') {
            steps {
                git branch: 'main',
                    url: 'git@github.com:nirmal-debug995/proshohfullstack.git'
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Prepare Backend with Frontend Build') {
            steps {
                sh '''
                    rm -rf backend/frontend
                    mkdir -p backend/frontend
                    cp -r frontend/build backend/frontend/
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t $ACR_LOGIN_SERVER/$IMAGE_NAME:latest -f backend/Dockerfile .
                '''
            }
        }

        /* ================================
           🔐 AZURE LOGIN (FIXED)
        ================================= */
        stage('Azure Login') {
            steps {
                withCredentials([
                    string(credentialsId: 'AZURE_CLIENT_ID', variable: 'AZURE_CLIENT_ID'),
                    string(credentialsId: 'AZURE_CLIENT_SECRET', variable: 'AZURE_CLIENT_SECRET'),
                    string(credentialsId: 'AZURE_TENANT_ID', variable: 'AZURE_TENANT_ID'),
                    string(credentialsId: 'AZURE_SUBSCRIPTION_ID', variable: 'AZURE_SUBSCRIPTION_ID')
                ]) {
                    sh '''
                        az login --service-principal \
                            -u $AZURE_CLIENT_ID \
                            -p $AZURE_CLIENT_SECRET \
                            --tenant $AZURE_TENANT_ID

                        az account set --subscription $AZURE_SUBSCRIPTION_ID
                    '''
                }
            }
        }

        stage('Login to ACR') {
            steps {
                sh '''
                    az acr login --name $ACR_NAME
                '''
            }
        }

        stage('Push Image to ACR') {
            steps {
                sh '''
                    docker push $ACR_LOGIN_SERVER/$IMAGE_NAME:latest
                '''
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
                        --image $ACR_LOGIN_SERVER/$IMAGE_NAME:latest \
                        --cpu 1 \
                        --memory 1.5 \
                        --ports 5000 \
                        --ip-address Public \
                        --restart-policy Always \
                        --registry-login-server $ACR_LOGIN_SERVER \
                        --registry-username $(az acr credential show --name $ACR_NAME --query username -o tsv) \
                        --registry-password $(az acr credential show --name $ACR_NAME --query passwords[0].value -o tsv)
                '''
            }
        }
    }
}
