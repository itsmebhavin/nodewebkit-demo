'use strict'

var gui = require('nw.gui');
var win = gui.Window.get(); // to get current window context.
var commands = gui.App.argv;

console.log('Commands - ');
console.log(commands);
var currentVersion = gui.App.manifest.version;
console.log('Version- ' + currentVersion);

angular.module('components.window',[])
.run(function($interval){
    //gui.App.setCrashDumpDir(dir);
    console.log('current exec path- ' + process.execPath)
    // Create a tray icon
    var tray = new gui.Tray({
        title: 'Tray',
        icon: '/public/images/Sync.png',
        tooltip:'eForms - nw.js'
    });
    // Give it a menu

    var developr = new gui.Menu({type:'menubar'});
    developr.append(new gui.MenuItem({
        label:'Check Versions',
        click:function(){
            alert(
                'Node.JS version - ' + process.versions['node'] + '\n' +
                'NodeWebkit version - ' + process.versions['node-webkit']
            );
        }
    }));
    developr.append(new gui.MenuItem({
        label:'Toggle Console Tools',
        click: function(){
            if(win.isDevToolsOpen())
            win.closeDevTools();
            else
            win.showDevTools();
        }
    }));
    developr.append(new gui.MenuItem({
        label:'Reload (same as toolbar reload)',
        click: function(){
            win.reloadDev();
        }
    }));
    developr.append(new gui.MenuItem({
        label:'Reload w/o Cache aka "Shift-Reload"',
        click: function(){
            win.reloadIgnoringCache();
        }
    }));
    developr.append(new gui.MenuItem({
        label:'Test update progress',
        click: function () {
            var promise, index = 1;
            win.setBadgeLabel(10 * 1);
            function start() {
                stop();
                promise = $interval(function () {
                    console.log('index:' + index);
                    if ((index * 10) > 100)
                        stop();
                    else {
                        index += 1;
                        console.log('index:' + index + '  ' + 10 * index);
                        win.setBadgeLabel(10 * index);
                    }
                }, 20000);
            }
            function stop() {
                $interval.cancel(promise);
            }
            start();

        }
    }));
    developr.append(new gui.MenuItem({
        label: 'Quit',
        click:  function() {
            // Hide the window to give user the feeling of closing immediately
            win.hide();
            // If the new window is still open then close it.
            if (win != null)
                win.close(true);
            // After closing the new window, close the main window.
            win.close();
        }    
    }));

    tray.menu = developr;
    // console.log('our tray is now completed and ready..!!')
})
.controller('windowCtrl', ['$rootScope', '$scope', 'windowFactory', function ($rootScope, $scope, windowFactory) {

    $rootScope.currentVersion = currentVersion;

    $scope.minWindow = function(){
        console.log('minimizing window');
        windowFactory.minWindow();
    }
    $scope.maxWindow = function(){
        // $scope.winRestore = true;  // by default it will be in restare mode.

        console.log('maximizing window');
        windowFactory.maxWindow();
        // $scope.winRestore = !$scope.winRestore;
    }
    $scope.closeWindow = function(){
        console.log('closing application now');
        windowFactory.closeWindow();
    }
}])

.factory('windowFactory',[function(){
    var factory = {};
    factory.maxWindow = function(){
        console.log('Is KioskMode - ' + win.isKioskMode);
        console.log('Is Fullscreen - ' + win.isFullscreen);
        if(win.isKioskMode){
            win.leaveKioskMode();
            win.restore();
        }
        else if (win.isFullscreen){
            win.toggleFullscreen();
            //win.restore();
        }
        else
        win.toggleFullscreen();
    }
    factory.minWindow = function(){
        win.minimize();
    };

    factory.closeWindow = function(){
        win.on('close', function() {
            // Hide the window to give user the feeling of closing immediately
            this.hide();
            // If the new window is still open then close it.
            if (win != null)
            win.close(true);
            // After closing the new window, close the main window.
            this.close(true);
        });

        win.close();
    }
    return factory;
}])
