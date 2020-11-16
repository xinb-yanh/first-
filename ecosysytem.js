export default {
    "apps": [{
        name: 'server',
        script: './index.js',
        instances: '4',
        exec_mode: "cluster",
        log_date_format: "YYYY-MM-DD HH:mm Z",
        restart_delay: 5000,
        env: {
            COMMON_VARIABLE: 'true'
        },
        env_production: {
            NODE_ENV: 'production',
            PORT: '8081',
            DOMAIN: '115.29.161.95',
            IP: '115.29.161.95'
        }
    }],
    "deploy": {
        // "production" is the environment name
        "production": {
            "user": "root",
            "ref": "origin/master",
            "repo": "git@github.com:xinb-yanh/first-.git",
            "path": "/root/gitserver/first-",
            "post-deploy": "npm install "
        }
    }
}