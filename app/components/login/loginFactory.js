'use strict';

(function() {
  angular
    .module('ci-app')
    .factory('loginFactory', LoginFactory);

  LoginFactory.$inject =
    ['$http', 'consts'];

  function LoginFactory($http, consts) {
    const vm = this;

    vm.methods = {};
    vm.user = null;

    vm.methods.getUser = () => getUser(vm, consts);

    vm.methods.login = (user, callback) => {
      vm.methods.submit('login', user, callback);
    };

    vm.methods.signup = (user, callback) => {
      vm.methods.submit('signup', user, callback);
    };

    vm.methods.submit = (url, user, callback) => {
      submit(url, user, callback, $http, consts);
    };

    vm.methods.logout = (callback) => logout($http, consts, vm, callback);

    return vm.methods;
  }

  function getUser(vm, consts) {
    if (!vm.user) {
      vm.user = JSON.parse(localStorage.getItem(consts.userKey));
    }
    return vm.user;
  }

  function submit(url, user, callback, ...params) {
    params[0].post(`${params[1].oapiUrl}/${url}`, user)
      .then((response) => {
        localStorage.setItem(params[1].userKey, JSON.stringify(response.data));
        if (callback) callback(null, response.data);
      })
      .catch((response) => {
        if (callback) callback(response.data);
      });
  }

  function logout(http, consts, vm, callback) {
    vm.user = null;
    localStorage.removeItem(consts.userKey);
    http.defaults.headers.common.Authorization = '';
    if (callback) callback(null);
  }
})();
