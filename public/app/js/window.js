'use strict'

var gui = require('nw.gui');
var win = gui.Window.get(); // to get current window context.

angular.module('components.window',[])
.run(function(){
  console.log('Node.JS version - ' + process.versions['node']);
  console.log('NodeWebkit version - ' + process.versions['node-webkit']);

  // var tray = new gui.Tray({ icon: 'images/Sync.png' });
  // Create a tray icon
  // console.log('Trying to create tray...');
  var tray = new gui.Tray({
    title: 'Tray',
    icon: '/public/images/Sync.png',
    tooltip:'eForms - nw.js'
  });
  // Give it a menu

  var developr = new gui.Menu({type:'menubar'});
  developr.append(new gui.MenuItem({
    label:'Toggle Dev Tools',
    click: function(){
      if(win.isDevToolsOpen())
      win.closeDevTools();
      else
      win.showDevTools();
    }
  }));
  developr.append(new gui.MenuItem({
    label:'Reload without Cache aka "Shift-Reload"',
    click: function(){
      win.reloadIgnoringCache();
    }
  }));


  tray.menu = developr;
  // console.log('our tray is now completed and ready..!!')
})
.controller('windowCtrl',['$scope','windowFactory',function($scope,windowFactory){

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
  factory.maxWindow = function(winState){
    // if(winState == true)
    //   win.maximize();
    // else
    //   win.unmaximize();
    console.log('Is KioskMode - ' + win.isKioskMode);
    console.log('Is Fullscreen - ' + win.isFullscreen);
    console.log('Is maximize - ' + win.maximize());
    if(win.isKioskMode)
    win.leaveKioskMode();

    win.restore();
    win.toggleFullscreen();
  }
  factory.minWindow = function(){
    win.minimize();
    /* NOTE: If you want to minimize to Tray , follow this code...
    // Load library
    var gui = require('nw.gui');
    // Reference to window and tray
    var win = gui.Window.get();
    var tray;
    // Get the minimize event
    win.on('minimize', function() {
    // Hide window
    this.hide();
    // Show tray
    tray = new gui.Tray({ icon: 'icon.png' });
    // Show window and remove tray when clicked
    tray.on('click', function() {
    win.show();
    this.remove();
    tray = null;
  });
});
//END tray code
*/
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
