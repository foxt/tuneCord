if which node > /dev/null
    then
        echo "node is installed."
	if [ -d "node_modules" ]; then
		echo "modules are in."
	else
		echo "installing modules"
		npm i
	fi
	node index

    else
        echo "NodeJS is  NOT installed. Please install it from https://nodejs.org."
fi
