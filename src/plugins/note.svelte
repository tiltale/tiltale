<div class="absolute w-full h-full" style="z-index: 1000"> 
    {#if obj.objects.length > 1}
    <div class="absolute top-[18%] left-[82%]" style="z-index: 3">
        <button class="btn btn-circle bg-black hover:bg-[#5E5E5E] border-black hover:border-[#5E5E5E] text-white" on:click={close}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
    </div>
    {/if}
        
    <img src="img/note/bg.svg" class="absolute w-full h-full" style="z-index: 1" />

    <div class="leading-relaxed w-[53%] left-[23%] top-[20%] absolute" style="z-index: 2">
        {#each obj.objects as o, index}
        {#if index == selected_id}
        <img src="project/img/{o.image}" />
        {/if}
        {/each}
    </div>   
    <div class="flex absolute top-[73%] left-[23%] w-[53%]" style="z-index: 2">
        <div>
            {#if obj.objects.length > 1}
            <button class="btn btn-circle btn-sm bg-black hover:bg-[#5E5E5E] {selected_id > 0?'':'btn-disabled'}" on:click={prev_page}>
                <svg width="100%" height="100%" viewBox="0 0 16 16" fill="#ffffff" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;" class="w-5 h-5">
                    <g transform="matrix(-1,0,0,1,15.9982,0)">                    
                        <path d="M2,8C2,7.589 2.339,7.25 2.75,7.25L11.44,7.25L8.22,4.03C8.091,3.891 8.019,3.708 8.019,3.519C8.019,3.107 8.357,2.769 8.769,2.769C8.958,2.769 9.141,2.841 9.28,2.97L13.78,7.47C14.071,7.761 14.071,8.239 13.78,8.53L9.28,13.03C9.141,13.159 8.958,13.231 8.769,13.231C8.357,13.231 8.019,12.893 8.019,12.481C8.019,12.292 8.091,12.109 8.22,11.97L11.44,8.75L2.75,8.75C2.339,8.75 2,8.411 2,8Z" style="stroke:#ffffff;stroke-width:1.38px;"/>
                    </g>
                </svg>
            </button>
            {/if}
        </div>
        <div class="flex-1">
            &nbsp;
        </div>
        <div>
            <button class="mt-[100%] btn btn-circle btn-sm bg-black hover:bg-[#5E5E5E] {obj.objects.length == 1 || selected_id < obj.objects.length-1?'':'btn-disabled'}" on:click={(obj.objects.length > 1)?next_page:close}>
                <svg width="100%" height="100%" viewBox="0 0 16 16" fill="#ffffff" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;" class="w-5 h-5">
                    <path d="M2,8C2,7.589 2.339,7.25 2.75,7.25L11.44,7.25L8.22,4.03C8.091,3.891 8.019,3.708 8.019,3.519C8.019,3.107 8.357,2.769 8.769,2.769C8.958,2.769 9.141,2.841 9.28,2.97L13.78,7.47C14.071,7.761 14.071,8.239 13.78,8.53L9.28,13.03C9.141,13.159 8.958,13.231 8.769,13.231C8.357,13.231 8.019,12.893 8.019,12.481C8.019,12.292 8.091,12.109 8.22,11.97L11.44,8.75L2.75,8.75C2.339,8.75 2,8.411 2,8Z" style="stroke:#ffffff;stroke-width:1.38px;"/>
                </svg>
            </button>            
        </div>
    </div>
</div>

<script lang="ts">
    export let obj = {};
    export let event_callback = undefined;

    let selected_id = 0;

    function close() {
        if (obj.events !== undefined) {
            event_callback(obj);
        }

        event_callback({
            "events": [
                {
                    "type": "hide_object",
                    "target": obj.id
                }
            ]
        });
    }   
    
    function next_page() {
        selected_id += 1;
    }

    function prev_page() {
        selected_id -= 1;
    }
</script>