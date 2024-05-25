def COLOR_MAP = [
    'SUCCESS': 'good',
    'FAILURE': 'danger'
]

pipeline{
    agent any

    environment {
        registryUrl = 'programmer175/conduit_django'
        registryCredential = 'programmer175'
        dockerImage = ''
    }

    stages{
        stage('Initialization & Unit Test'){
            steps{
                sh 'pip install -r requirements.txt'
                sh 'python3 manage.py makemigrations'
                sh 'python3 manage.py migrate --database=default'
                sh 'python3 manage.py test'
            }
        }

      stage('OWASP Dependency-Check Vulnerabilities') {
    environment {
        NVD_API_KEY = credentials('NVD_API_KEY')
    }
    steps {
        dependencyCheck additionalArguments: ''' 
                    -o './'
                    -s './'
                    -f 'ALL' 
                    --prettyPrint
                    --nvdApiKey ${NVD_API_KEY}
                    ''', odcInstallation: 'OWASP Dependency-Check Vulnerabilities'
        
        dependencyCheckPublisher pattern: 'dependency-check-report.xml'
      }
}


        stage ('Build Docker Image') {
            steps {
                script {
                   dockerImage = docker.build registryUrl + ":$BUILD_NUMBER"
                }
            }
            
        }

        stage('Image Vulnerability Scan') {
            steps {
                script {
                    sh """trivy image --format template --template "@/usr/bin/html.tpl" --output trivy_report.html ${registryUrl}:${BUILD_NUMBER}""" 
                }
            }
        }

        stage ('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry( '', registryCredential ) {
                        dockerImage.push()
                    }
                }
            }
        }

    stage('Update Deployment file') {
     steps {
        sshagent(['GITHUB_SSH']) {
            sh '''
                rm -rf conduit-manifests
                git config --global user.email "sidhurv8@gmail.com"
                git config --global user.name "sidhu2003"
                git clone git@github.com:sidhu2003/conduit-manifests.git
                cd conduit-manifests
                sed -i 's|programmer175/conduit_django:.*|programmer175/conduit_django:'"$BUILD_NUMBER"'|' backend_deployment.yaml
                git add backend_deployment.yaml
                git commit -m "updating backend image version to $BUILD_NUMBER"
                git push origin main
            '''
        }
    }
}

    }

     post {
        always {
            archiveArtifacts artifacts: "trivy_report.html", fingerprint: true
            publishHTML (target: [
                allowMissing: false,
                alwaysLinkToLastBuild: false,
                keepAll: true,
                reportDir: '.',
                reportFiles: 'trivy_report.html',
                reportName: 'Trivy Scan',
                ])
            }
        }

     post{
        always {
            echo 'Slack Notification'
            slackSend channel: '#app',
            color: COLOR_MAP[currentBuild.currentResult],
            message: "*${currentBuild.currentResult}:* Job ${env.JOB_NAME}"
        }
     }
}