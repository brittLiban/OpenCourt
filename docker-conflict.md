# RCA: Docker error when installing on VM

## Presenting Issue:
When I was trying to install the repo into the VM, following the readMe VM Install instructions, I ran into a error that would not be able to download the Project when using the following script. 

The specific script -

*chmod +x prepare-vm.sh setup.sh*

## Investigation & Troubleshooting Steps:
* The first part was to reproduce the issue by follow the ReadMe's instructions again more thorughly and see if this is a issue was a user error or system error.
* I noticed I was able to re-create the same consistent issue which involved docker surrounded docker
  * it was 2 fold - One for not being able to download docker and the script docker cmds being out of date
* I checked out the script and noticed that it would automatically install docker and wouldn't check if it was already installed on the VM.
* This lead me to understand that the Script needed to handle the case when docker was already installed so it can prevent the issue


## Mitigation:
To prevent any issues surrounding the enviorment with Docker, we decided to just uninstall the current installation of docker on the VM. Then install a specified version. This will prevent any syntax issues, configuration and ensure a smooth installation as all dependencies will already be fixed and accounted for its specific enviorment.

## Corrective Actions:
* **Updated VM Setup Script:**
    * **Check if docker is already installed in script:** Added a check to see if docker was currently installed. If so, then uninstall it and install the correct version. If not, then install Docker. 
    * **Fixing Syntax:** The previous docker installation used old syntax, for ex: docker*-*compose... In this specific installation of Docker it will use the standard docker compose instead. Combed through the code and replaced and updated all syntax 
* **Added Error Handling:** Added clean error handling to ensure that in the future if any future issues with docker are faced. Then they will be clearly labeled for future users to see exactly where things went wrong.
