<?php

namespace Modules\Shop\Http\Livewire\Components;

use Livewire\Component;

class LanguageSelector extends Component
{
    public $current = [];

    public $languages = [];

    public function mount()
    {
        $langFiles = json_decode(file_get_contents(lang_path('languages.json')));

        $this->languages = $langFiles->available ?? [];
        $this->current = collect($this->languages)->firstWhere(fn ($lang) => $lang->value == app()->getLocale()) ?? ['label' => 'English', 'value' => 'en', 'flag' => 'US'];
    }

    public function render()
    {
        return view('shop::components.shared.language-selector');
    }

    public function select($code)
    {
        $language = collect($this->languages)->firstWhere('value', $code);
        session(['shop_language' => $language]);
        app()->setLocale($language->value);

        cookie()->queue(cookie()->forever('language', $language->value));
        session()->flash('title', __('Use {x}', ['x' => $language->label]));
        session()->flash('success', __(':model has been :action', ['model' => __('Language'), 'action' => __('changed')]));

        return url()->previous() ? $this->redirect(url()->previous()) : $this->redirectRoute('shop.home');
    }
}
