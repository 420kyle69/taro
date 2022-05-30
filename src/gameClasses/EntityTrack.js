var EntityTrack = /** @class */ (function () {
    function EntityTrack() {
        console.log('EntityTrack');
        this.trackEntityById = {};
    }
    EntityTrack.prototype.frameTick = function () {
        ige.engineStep();
        ige.input.processInputOnEveryFps();
        this.timeStamp = Date.now();
        /*if (this.resizeQueuedAt && this.resizeQueuedAt < ige._currentTime - 250) {
            this.resize();
            this.resizeQueuedAt = undefined;
        }*/
        /*if (this && this.updateAllEntities) {
            this.updateAllEntities();

            if (this.isUpdateLayersOrderQueued) {
                this.app.stage.updateLayersOrder();
                this.isUpdateLayersOrderQueued = false;
            }
            ige._renderFrames++;
        }
        if (ige.pixi.viewport.dirty && ige._cullCounter % 4 == 0) {
            ige.pixi.cull.cull(ige.pixi.viewport.getVisibleBounds());
            ige.pixi.viewport.dirty = false;
        }

        ige._cullCounter++;

        ige.pixi.app.render();*/
        // this.resizeCount = 0;
    };
    EntityTrack.prototype.updateAllEntities = function ( /*timeStamp*/) {
        var currentTime = Date.now();
        if (!ige.lastTickTime)
            ige.lastTickTime = currentTime;
        var tickDelta = currentTime - ige.lastTickTime;
        //console.log('entities count', Object.keys(this.trackEntityById).length);
        // var entityCount = {unit: 0, item:0, player:0, wall:0, projectile: 0, undefined: 0, floatingLabel: 0}
        for (var entityId in this.trackEntityById) {
            //this delete _pixiContainer if it is _destroyed - maybe we can emit here destroy phaser sprite in future?
            if (this.trackEntityById[entityId]._destroyed) {
                delete this.trackEntityById[entityId];
                break;
            }
            var entity = ige.$(entityId);
            if (entity) {
                // while zooming in/out, scale both unit name labels, attribute bars, and chatBubble
                /*if (ige.pixi.viewport.isZooming) {
                    if (entity.unitNameLabel) {
                        entity.unitNameLabel.updateScale();
                        entity.unitNameLabel.updatePosition();
                    }

                    if (entity.attributeBars) {
                        _.forEach(entity.attributeBars, function (attributeBar) {
                            var bar = ige.$(attributeBar.id);
                            bar.updateScale();
                            bar.updatePosition();
                        });
                    }*/
                /*if (openChatBubble[entityId]) {
                    var chatBubble = ige.$(openChatBubble[entityId]);
                    chatBubble.updateScale();
                    chatBubble.updatePosition();
                }*/
                //}
                // handle entity behaviour and transformation offsets
                /*if (ige.gameLoopTickHasExecuted) {
                    if (entity._deathTime !== undefined && entity._deathTime <= ige._tickStart) {
                        // Check if the deathCallBack was set
                        if (entity._deathCallBack) {
                            entity._deathCallBack.apply(entity);
                            delete entity._deathCallBack;
                        }
                        entity.destroy();
                    }

                    if (entity._behaviour && !entity.isHidden()) {
                        entity._behaviour();
                    }

                    // handle streamUpdateData
                    if (ige.client.myPlayer) {
                        var updateQueue = ige.client.entityUpdateQueue[entityId];
                        if (updateQueue && updateQueue.length > 0) {
                            var nextUpdate = updateQueue[0];
                            if (
                            // Don't run if we're updating item's state/owner unit, but its owner doesn't exist yet
                                entity._category == 'item' &&
                                ((nextUpdate.ownerUnitId && ige.$(nextUpdate.ownerUnitId) == undefined) || // updating item's owner unit, but the owner hasn't been created yet
                                    ((nextUpdate.stateId == 'selected' || nextUpdate.stateId == 'unselected') && entity.getOwnerUnit() == undefined)) // changing item's state to selected/unselected, but owner doesn't exist yet
                            ) {
                                // console.log("detected update for item that don't have owner unit yet", entity.id(), nextUpdate)
                            } else {
                                // console.log("entityUpdateQueue", entityId, nextUpdate)
                                entity.streamUpdateData([nextUpdate]);
                                ige.client.entityUpdateQueue[entityId].shift();
                            }
                        }
                    }
                }*/
                // return if entity is culled
                // if (entity.isCulled) {
                //     continue;
                // }
                // update transformation using incoming network stream
                /*if (ige.network.stream && ige._renderLatency != undefined) {
                    entity._processTransform();
                }

                if (entity._translate && !entity.isHidden()) {
                    var x = entity._translate.x;
                    var y = entity._translate.y;
                    var rotate = entity._rotate.z;

                    if (entity._category == 'item') {
                        var ownerUnit = entity.getOwnerUnit();
                        if (ownerUnit) {
                            ownerUnit._processTransform(); // if ownerUnit's transformation hasn't been processed yet, then it'll cause item to drag behind. so we're running it now

                            // immediately rotate items for my own unit
                            if (ownerUnit == ige.client.selectedUnit) {
                                if (entity._stats.currentBody && entity._stats.currentBody.jointType == 'weldJoint') {
                                    rotate = ownerUnit._rotate.z;
                                } else if (ownerUnit == ige.client.selectedUnit) {
                                    rotate = ownerUnit.angleToTarget; // angleToTarget is updated at 60fps
                                }
                            }

                            entity.anchoredOffset = entity.getAnchoredOffset(rotate);
                            if (entity.anchoredOffset) {
                                x = ownerUnit._translate.x + entity.anchoredOffset.x;
                                y = ownerUnit._translate.y + entity.anchoredOffset.y;
                                rotate = entity.anchoredOffset.rotate;
                            }
                        }
                    }

                    if (entity.tween && entity.tween.isTweening) {
                        entity.tween.update();
                        x += entity.tween.offset.x;
                        y += entity.tween.offset.y;
                        rotate += entity.tween.offset.rotate;
                    }

                    entity.transformPixiEntity(x, y, rotate);
                    // if (entity._pixiCollider && entity.bodyDef.type != 'static' && entity.bodyDef) {
                    // 	var w_xf = entity._pixiCollider.transform.worldTransform;
                    // 	console.log(
                    // 		`World xy:  (${w_xf.tx}, ${w_xf.ty})` +
                    // 		`\nLocal x-axis slope: ${w_xf.c / w_xf.a}` +
                    // 		`\nLocal y-axis slope: ${w_xf.d / w_xf.b}`
                    // 	);
                    // }

                    // handle animation
                    if (entity.pixianimation) {
                        if (entity.pixianimation.animating) {
                            if (!entity.pixianimation.fpsCount) {
                                entity.pixianimation.fpsCount = 0;
                            }

                            if (entity.pixianimation.fpsCount > entity.pixianimation.fpsSecond) {
                                entity.pixianimation.animationTick();
                                entity.pixianimation.fpsCount = 0;
                            }
                            entity.pixianimation.fpsCount += tickDelta;
                        }
                    }
                }*/
            }
        }
        ige.lastTickTime = currentTime;
        /*if (ige.gameLoopTickHasExecuted) {
            ige.gameLoopTickHasExecuted = false;
        }*/
    };
    return EntityTrack;
}());
//# sourceMappingURL=EntityTrack.js.map