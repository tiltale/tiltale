<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->

<script lang="ts">
    import { onMount } from "svelte";
    export let obj = {};
    export let event_callback = undefined;
    export let variables = [];

    let timers = [];

    $: {
        timers.forEach((t, i) => {
            // Start and pause timers

            if (variables[`is_running_${t.id}`] != undefined && timers[i].has_finished == false) {
                timers[i].is_running = variables[`is_running_${t.id}`];
                variables[`is_running_${t.id}`] = undefined;

                if (timers[i].is_running) {
                    timers[i].interval = setInterval(() => {
                        timers[i].value += obj.step;

                        // If exceeding reserved time

                        if (timers[i].value >= (timers[i].duration - timers[i].reserved_value) && timers[i].exceed_reserved_value_actions && !timers[i].has_exceeded) {
                            timers[i].has_exceeded = true;
                            const events = timers[i].exceed_reserved_value_actions.events;

                            if (events && events.filter(e => e.type == "goto_scene").length > 0) {
                                clearInterval(timers[i].interval);
                            }
                            
                            event_callback(timers[i].exceed_reserved_value_actions);
                        }

                        // If finished

                        if (timers[i].value >= timers[i].duration) {
                            timers[i].has_finished = true;
                            timers[i].is_running = false;
                            clearInterval(timers[i].interval);

                            if (timers[i].finished_actions) {
                                event_callback(timers[i].finished_actions);
                            }
                        }
                    }, 10);
                } else {
                    if (t.interval) {
                        clearInterval(timers[i].interval);
                    }
                }
            }

            // Set timer value

            if (variables[`value_${t.id}`] != undefined) {
                const value = variables[`value_${t.id}`];
                variables[`value_${t.id}`] = undefined;
                timers[i].value = value < timers[i].duration ? value : timers[i].duration;
            }

            // Set timer duration

            if (variables[`duration_${t.id}`] != undefined) {
                const duration = variables[`duration_${t.id}`];
                variables[`duration_${t.id}`] = undefined;
                timers[i].duration = duration;
            }

            // Set timer reserved value

            if (variables[`reserved_value_${t.id}`] != undefined) {
                const reserved_value = variables[`reserved_value_${t.id}`];
                variables[`reserved_value_${t.id}`] = undefined;
                timers[i].reserved_value = reserved_value < timers[i].duration ? reserved_value : timers[i].duration;
            }
        });

        // Change value

        if (variables[`change_${obj.id}`]) {
            const value = variables[`change_${obj.id}`];
            variables[`change_${obj.id}`] = undefined;

            const runningTimers = timers.filter(t => {return t.is_running == true && t.has_finished == false});
            let total_time_residual = 0;

            runningTimers.forEach(t => {
                const index = timers.findIndex(ti => {return ti.id == t.id});

                if (t.value + value < t.duration) {
                    timers[index].value += value;
                } else {
                    const time_residual = t.value + value - t.duration;
                    timers[index].value = t.duration;
                    total_time_residual += time_residual;
                }
            });

            if (total_time_residual > 0) {
                variables[`change_${obj.id}`] = total_time_residual;
            }
        }

        // Set step

        if (variables[`step_${obj.id}`]) {
            const value = variables[`step_${obj.id}`];
            variables[`step_${obj.id}`] = undefined;
            obj.step = value;
        }
    }

    onMount(() => {
        event_callback(
            obj,
            obj.objects.filter((o) => {
                return o.id == "texts";
            })[0],
        );

        // Timer

        const timedPeriodSettings = obj.objects.filter((o) => {return o.type == "periods"})[0];
        const timedPeriods = timedPeriodSettings.objects;

        if (timedPeriods) {
            timedPeriods.forEach((period, i) => {
                timers.push({
                    "id": period.id,
                    "value": 0,
                    "duration": period.duration,
                    "is_running": false,
                    "has_finished": false,
                    "has_exceeded": false,
                    "interval": undefined,
                    "reserved_value": period.reserved_value ? period.reserved_value : undefined,
                    "finished_actions": period.finished_actions,
                    "exceed_reserved_value_actions": period.exceed_reserved_value_actions
                });
            });
        }
    });
</script>

<style>
    .planner-timer-container {
        display: grid;
        grid-auto-flow: column;
    }

    .planner-timer-container .period {
        display: grid;
        grid-auto-flow: row;
        grid-gap: 5px;    
        padding-top: 10px;
        border-right: 2px dotted grey;
    }

    .planner-timer-container .period .name {
        padding-left: 10px;
    }

    .planner-timer-container .period:last-of-type {
        border-right: none;
    }

    .planner-timer-container .period:not(:first-of-type):not(:last-of-type) .timer-toolbar-container {
        border-radius: 0;
        border-left: none;
        border-right: none;
        padding-right: 0;
        padding-left: 0;
    }

    .planner-timer-container .period:not(:first-of-type):not(:last-of-type) .timer-toolbar-fill {
        border-radius: 0;
    }

    .planner-timer-container .period:first-of-type .timer-toolbar-container {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right: none;
        padding-right: 0;
    }

    .planner-timer-container .period:first-of-type .timer-toolbar-fill {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .planner-timer-container .period:last-of-type .timer-toolbar-container {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-left: none;
        padding-left: 0;
    }

    .planner-timer-container .period:last-of-type .timer-toolbar-fill {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    .planner-timer-container .period:last-child .timer-toolbar-fill.reserved {
        right: 3px;
    }

    .timer-toolbar-container {
        position: relative;
        height: 14px;
        width: 100%;
        border-radius: 10px;
        background-color: white;
        border: 2px solid #4a00ff;
        padding: 2px;
    }

    .timer-toolbar-fill {
        position: relative;
        height: 6px;
        background-color: #4a00ff;
        border-radius: 7px;
        z-index: 2;
    }

    .timer-toolbar-fill.reserved {
        position: absolute;
        background-color: #FF8A43;
        right: 0px;
        top: 2px;
        z-index: 1;
    }
</style>

<div
    class="absolute card bg-base-100 shadow-xl min-w-[15vw]"
    style="
        {obj.width !== undefined ? 'width: ' + obj.width + '; ' : ''}
        {obj.height !== undefined ? 'height: ' + obj.height + '; ' : ''}
        {obj.x !== undefined ? 'left: ' + obj.x + '; ' : ''}
        {obj.y !== undefined ? 'top: ' + obj.y + '; ' : ''} 
        {obj.backgroundColor !== undefined ? `background-color: ${obj.backgroundColor};` : ''}
        {obj.y == "0%" ? "border-top-right-radius: 0; border-top-left-radius: 0;" : ""} 
">
    <div class="card-body">
        {#if obj.objects !== undefined}
            {#each obj.objects as o}
                {#if o.visible == true}
                    <div class="planner-timer-container">
                        {#if o.type == "periods" && o.objects.length > 0}
                            {#each o.objects as p, i}
                                <div class="period">
                                    <div class="timer-toolbar-container">
                                        <div class="timer-toolbar-fill" style="width: {timers[i] ? timers[i].value / timers[i].duration * 100 : 0}%;"></div>

                                        {#if timers[i] && timers[i].reserved_value}
                                            <div class="timer-toolbar-fill reserved" style="width: {timers[i].reserved_value / timers[i].duration * 100}%;"></div>
                                        {/if}
                                    </div>
                                    <p class="name">
                                        <span>{p.display_caption}</span>
                                        {#if timers[i]}
                                            <span>{'('}{Math.round(timers[i].value / 1000)}/{Math.round(timers[i].duration / 1000)}{')'}</span>
                                        {/if}
                                    </p>
                                </div>
                            {/each}
                        {/if}
                    </div>
                {/if}
            {/each}
        {/if}
    </div>
</div>