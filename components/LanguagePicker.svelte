<script>
  import { locale, locales, getLocaleFromNavigator, _  } from 'svelte-i18n'
  import { locales as localesInfo } from '$lib/i18n';
  import * as cookie from 'cookie'
  import { onMount } from 'svelte'

  let selectedLanguage = '_system'

  onMount(() => {
    const cookies = cookie.parse(document.cookie)
    selectedLanguage = cookies.uiLanguage || '_system'
  })

  function handleLanguageChange(event) {
    const newLang = event.target.value
    document.cookie = cookie.serialize('uiLanguage', newLang, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    })
    $locale = newLang === '_system' ? getLocaleFromNavigator() : newLang
  }
</script>

<select 
  bind:value={selectedLanguage} 
  on:change={handleLanguageChange}
>
  <option value="_system">System language</option>
  {#each $locales as loc}
    <option value={loc}>{localesInfo[loc][0]}</option>
  {/each}
</select>