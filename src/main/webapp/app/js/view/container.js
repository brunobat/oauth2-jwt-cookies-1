/**
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

(function () {
    'use strict';

    var deps = ['app/js/templates', 'app/js/model/auth', 'app/js/i18n', 'lib/backbone'];
    define(deps, function (templates, auth, il8n, Backbone) {

        var View = Backbone.View.extend({
            initialize: function(options){
                this.options = options || {};
            },
            el: 'body',
            events: {
                'click .ux-logout': function (evt) {
                    evt.preventDefault();
                    var me = this,
                        router = window.BackboneApp.getRouter();
                    auth.logout()
                        .then(
                            function () {
                                router.navigate('login', {
                                    trigger: true
                                });
                            }
                        )
                }
            },
            showView: function (view) {
                var me = this;
                var contentArea = me.$('.ux-content-area');
                if (me.currentView) {
                    me.currentView.$el.detach();
                }
                me.currentView = view;
                me.currentView.render();
                contentArea.append(me.currentView.el);

                var access = auth.get('auth');
                me.$('.ux-logout').toggle('d-none', access);

                if (view.renderCallback) {
                    view.renderCallback();
                }
                me.$('.ux-app-menu-item').removeClass('active');
                var myMenuItem = me.$('li.ux-app-menu-item.' + view.className);
                myMenuItem.addClass('active');
            },

            render: function (reRender) {
                if (!reRender && this.options.isRendered) {
                    return this;
                }
                var html = templates.getValue('container', {
                    userName: auth.get('username')
                });
                this.$el.html(html);

                // render it only once
                this.options.isRendered = true;
                return this;
            }
        });

        return new View({});
    });
}());