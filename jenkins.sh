dokku_public () {
  /usr/libexec/jenkins-git/git-ssh dokku@deploy.bbcnewslabs.co.uk "$*"
}

dokku_internal () {
  /usr/libexec/jenkins-git/git-ssh dokku@deploy.newslabs.co "$*"
}

dokku_internal storage:list $JOB_NAME |grep /app/data || dokku_internal storage:mount $JOB_NAME /var/lib/dokku/data/storage/$JOB_NAME:/app/data

git push dokku@deploy.newslabs.co:$JOB_NAME HEAD:refs/heads/master
