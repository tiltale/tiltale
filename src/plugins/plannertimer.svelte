<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->

<script lang="ts">
    import { onMount } from "svelte";
    export let obj = {};
    export let event_callback = undefined;
    export let variables = [];

    let prev_timers = undefined;
    let timers = [];

    $: {
        timers.forEach((t, i) => {
            // Start and pause timers

            if (variables[`is_running_${t.id}`] != undefined && variables[`is_running_${t.id}`] != t.is_running) {
                timers[i].is_running = variables[`is_running_${t.id}`];

                if (timers[i].is_running) {
                    timers[i].interval = setInterval(() => {
                        timers[i].value += 10;

                        if (timers[i].value >= timers[i].duration) {
                            timers[i].has_finished = true;
                            clearInterval(timers[i].interval);
                            console.log(`${timers[i].id} is stopped`);
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
                timers[i].value = variables[`value_${t.id}`];
            }

            // Set blocked time

            if (variables[`blocked_value_${t.id}`]) {
                timers[i].blocked_value = variables[`blocked_value_${t.id}`];
            }

            // Set timer reserved value

            if (variables[`reserved_value_${t.id}`] != undefined) {
                timers[i].reserved_value = variables[`reserved_value_${t.id}`];
            }
        });
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
                    "interval": undefined,
                    "reserved_value": period.reserved_value ? period.reserved_value : undefined
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
        height: 6px;
        background-color: #4a00ff;
        border-radius: 7px;
    }

    .timer-toolbar-fill.reserved {
        position: absolute;
        background-color: #a480ff;
        right: 0px;
        top: 2px;
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