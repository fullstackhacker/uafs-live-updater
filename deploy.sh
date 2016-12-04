set -e

cd /uafs/liveUpdater

PROD=uafs-liveupdater-prod-`date +%Y-%m-%d_%H:%M`

echo "Cloning from Github"
git clone git@github.com:kapadiamush/uafs-live-updater $PROD
echo "Finished cloning from Github"

(cd $PROD && npm install)
echo "Finished installing node modules"

ln -nsf `pwd`/$PROD current    # symlink so we know which one we're using currently

echo "Killing off old process"
fuser -k 2999/tcp

cd current

echo "Starting app!"
(npm start&) > /var/log/uafs/uafs_liveupdater.log
echo "Done!"
