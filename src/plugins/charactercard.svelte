<div class="absolute" style="
            {(obj.width !== undefined)?'width: ' + obj.width + '; ':''}
            {(obj.height !== undefined)?'height: ' + obj.height + '; ':''}
            {(obj.x !== undefined)?'left: ' + obj.x + '; ':''}
            {(obj.y !== undefined)?'top: ' + obj.y + '; ':''} 
            {(obj.z !== undefined)?'z-index: ' + obj.z + '; ':''}             
        ">
        <div class="card bg-base-100 shadow-xl">
            <div class="card-body text-[2vw] leading-snug p-[1vw] text-center">
            {#if obj.description !== undefined}
            <p>{obj.description}</p>
            {/if}
            </div>
        </div> 
        <div class="card bg-base-100 shadow-xl mt-[2vw]" style="{obj.color !== undefined?'background-color: ' + obj.color + ';':''} {obj.text_color !== undefined?'color: ' + obj.text_color + ';':''}">
            <div class="card-body leading-snug p-[5vw] flex flex-row">
                <div class="w-[40%] bg-white rounded-[1vw] pt-[1vw] flex flex-end">
                    <img src="project/img/{obj.image}" />
                </div>
                <div class="w-[60%] text-[1.5vw] p-[2vw] flex flex-col">
                    {#if obj.traits !== undefined}
                    <table>
                    {#each obj.traits as t}
                        <tr>
                            <td class="align-top font-bold pb-[2vw]">
                                {t.description}:
                            </td>
                            <td class="align-top pl-[1vw]">
                                {t.value}
                            </td>
                        </tr>
                    {/each}
                    </table>
                    {/if}

                    <div class="text-right absolute right-[4vw] bottom-[4vw]">
                        <button class="btn btn-circle btn-sm bg-black border-black hover:border-white hover:bg-white" on:click={(obj.events !== undefined && obj.events.length > 0)?close_callback(obj):undefined}>
                            <svg width="100%" height="100%" viewBox="0 0 16 16" fill="{obj.color !== undefined?obj.color:'#ffffff'}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;" class="w-5 h-5">
                                <path d="M2,8C2,7.589 2.339,7.25 2.75,7.25L11.44,7.25L8.22,4.03C8.091,3.891 8.019,3.708 8.019,3.519C8.019,3.107 8.357,2.769 8.769,2.769C8.958,2.769 9.141,2.841 9.28,2.97L13.78,7.47C14.071,7.761 14.071,8.239 13.78,8.53L9.28,13.03C9.141,13.159 8.958,13.231 8.769,13.231C8.357,13.231 8.019,12.893 8.019,12.481C8.019,12.292 8.091,12.109 8.22,11.97L11.44,8.75L2.75,8.75C2.339,8.75 2,8.411 2,8Z" style="stroke:{obj.color !== undefined?obj.color:'#ffffff'};stroke-width:1.38px;"/>
                            </svg>
                        </button>            
                    </div>
        
                </div>
            </div>
        </div> 
  </div>

<script lang="ts">
    export let obj = {};
    export let close_callback = undefined;

</script>