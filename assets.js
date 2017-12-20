'use strict';

module.exports = {
    client: {
        css: [
            'landcoverportal/static/css/*.css',
        ],
        js: [
            'landcoverportal/static/app/*.js',
            'landcoverportal/static/app/**/*.js'
        ],
        views: [
            'landcoverportal/templates/*.html',
            'landcoverportal/templates/**/*.html',
        ],
        templates: ['static/templates.js']
    },
    server: {
        gulpConfig: ['gulpfile.js']
    }
};