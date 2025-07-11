'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Globe, MapPin, Clock, DollarSign, Calendar, Phone, Building, RefreshCw, Save } from 'lucide-react'
import { getLocaleSettings, updateLocaleSettings } from './actions'
import { commonTimezones, commonCountries, commonLanguages } from '@/lib/locale-utils'
import { type LocaleSettings } from '@/lib/types'
import { SettingsLayout } from '@/components/dashboard/settings-layout'

export default function LocaleSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  const [localeSettings, setLocaleSettings] = useState<LocaleSettings>({
    id: 1,
    restaurant_timezone: 'Europe/London',
    country_code: 'GB',
    language_code: 'en-GB',
    currency_code: 'GBP',
    currency_symbol: '£',
    currency_decimal_places: 2,
    date_format: 'dd/MM/yyyy',
    time_format: 'HH:mm',
    first_day_of_week: 1,
    decimal_separator: '.',
    thousands_separator: ',',
    restaurant_name: 'Dona Theresa',
    restaurant_phone: '+44 20 8421 5550',
    restaurant_address: '451 Uxbridge Road, Pinner',
    restaurant_city: 'London',
    restaurant_postal_code: 'HA5 1AA',
    created_at: '',
    updated_at: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const settings = await getLocaleSettings()
      setLocaleSettings(settings)
      toast.success('Settings loaded successfully')
    } catch (error) {
      console.error('Error loading locale settings:', error)
      toast.error('Failed to load locale settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const result = await updateLocaleSettings(localeSettings)
      if (result.success) {
        toast.success('Locale settings saved successfully!')
      } else {
        toast.error(result.message || 'Failed to save locale settings')
      }
    } catch (error) {
      console.error('Error saving locale settings:', error)
      toast.error('Failed to save locale settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCountryChange = (countryCode: string) => {
    const country = commonCountries.find(c => c.code === countryCode)
    if (country) {
      setLocaleSettings(prev => ({
        ...prev,
        country_code: countryCode,
        currency_code: country.currency,
        currency_symbol: country.symbol
      }))
    }
  }

  const handleTimezoneChange = (timezone: string) => {
    setLocaleSettings(prev => ({
      ...prev,
      restaurant_timezone: timezone
    }))
  }

  if (isLoading) {
    return (
      <SettingsLayout
        title="Locale Settings"
        description="Configure location, timezone, currency and formatting preferences"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-slate-600" />
            <p className="text-slate-600">Loading settings...</p>
          </div>
        </div>
      </SettingsLayout>
    )
  }

  return (
    <SettingsLayout
      title="Locale Settings"
      description="Configure location, timezone, currency and formatting preferences"
      primaryAction={{
        label: "Save Settings",
        onClick: handleSave,
        loading: isSaving,
        loadingLabel: "Saving...",
        disabled: isSaving
      }}
      secondaryAction={{
        label: "Refresh",
        onClick: loadData,
        loading: isLoading,
        loadingLabel: "Loading...",
        disabled: isLoading,
        variant: "outline"
      }}
    >
      <div className="w-full max-w-full space-y-4 md:space-y-6">
        {/* Location & Timezone */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              Location & Timezone
            </CardTitle>
            <CardDescription className="text-slate-600">
              Configure your restaurant's location and timezone for accurate booking times
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country" className="text-slate-900">Country</Label>
                <Select value={localeSettings.country_code} onValueChange={handleCountryChange}>
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    {commonCountries.map(country => (
                      <SelectItem key={country.code} value={country.code} className="text-slate-900">
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-slate-900">Timezone</Label>
                <Select value={localeSettings.restaurant_timezone} onValueChange={handleTimezoneChange}>
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    {commonTimezones.map(timezone => (
                      <SelectItem key={timezone.value} value={timezone.value} className="text-slate-900">
                        {timezone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="text-slate-900">Language</Label>
              <Select 
                value={localeSettings.language_code} 
                onValueChange={(value) => setLocaleSettings(prev => ({ ...prev, language_code: value }))}
              >
                <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  {commonLanguages.map(language => (
                    <SelectItem key={language.code} value={language.code} className="text-slate-900">
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Currency & Number Formatting */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              Currency & Number Formatting
            </CardTitle>
            <CardDescription className="text-slate-600">
              Set currency and number formatting preferences for your locale
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency_code" className="text-slate-900">Currency Code</Label>
                <Input
                  id="currency_code"
                  value={localeSettings.currency_code}
                  onChange={(e) => setLocaleSettings(prev => ({ ...prev, currency_code: e.target.value }))}
                  placeholder="GBP"
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency_symbol" className="text-slate-900">Currency Symbol</Label>
                <Input
                  id="currency_symbol"
                  value={localeSettings.currency_symbol}
                  onChange={(e) => setLocaleSettings(prev => ({ ...prev, currency_symbol: e.target.value }))}
                  placeholder="£"
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency_decimal_places" className="text-slate-900">Decimal Places</Label>
                <Select 
                  value={localeSettings.currency_decimal_places.toString()} 
                  onValueChange={(value) => setLocaleSettings(prev => ({ ...prev, currency_decimal_places: parseInt(value) }))}
                >
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                    <SelectValue placeholder="Select decimal places" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="0" className="text-slate-900">0</SelectItem>
                    <SelectItem value="1" className="text-slate-900">1</SelectItem>
                    <SelectItem value="2" className="text-slate-900">2</SelectItem>
                    <SelectItem value="3" className="text-slate-900">3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="decimal_separator" className="text-slate-900">Decimal Separator</Label>
                <Select 
                  value={localeSettings.decimal_separator} 
                  onValueChange={(value) => setLocaleSettings(prev => ({ ...prev, decimal_separator: value }))}
                >
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                    <SelectValue placeholder="Select separator" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="." className="text-slate-900">. (period)</SelectItem>
                    <SelectItem value="," className="text-slate-900">, (comma)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thousands_separator" className="text-slate-900">Thousands Separator</Label>
                <Select 
                  value={localeSettings.thousands_separator} 
                  onValueChange={(value) => setLocaleSettings(prev => ({ ...prev, thousands_separator: value }))}
                >
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                    <SelectValue placeholder="Select separator" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="," className="text-slate-900">, (comma)</SelectItem>
                    <SelectItem value="." className="text-slate-900">. (period)</SelectItem>
                    <SelectItem value=" " className="text-slate-900"> (space)</SelectItem>
                    <SelectItem value="'" className="text-slate-900">′ (apostrophe)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date & Time Formatting */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              Date & Time Formatting
            </CardTitle>
            <CardDescription className="text-slate-600">
              Configure how dates and times are displayed in your system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_format" className="text-slate-900">Date Format</Label>
                <Select 
                  value={localeSettings.date_format} 
                  onValueChange={(value) => setLocaleSettings(prev => ({ ...prev, date_format: value }))}
                >
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="dd/MM/yyyy" className="text-slate-900">DD/MM/YYYY (UK)</SelectItem>
                    <SelectItem value="MM/dd/yyyy" className="text-slate-900">MM/DD/YYYY (US)</SelectItem>
                    <SelectItem value="yyyy-MM-dd" className="text-slate-900">YYYY-MM-DD (ISO)</SelectItem>
                    <SelectItem value="dd-MM-yyyy" className="text-slate-900">DD-MM-YYYY</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time_format" className="text-slate-900">Time Format</Label>
                <Select 
                  value={localeSettings.time_format} 
                  onValueChange={(value) => setLocaleSettings(prev => ({ ...prev, time_format: value }))}
                >
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                    <SelectValue placeholder="Select time format" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="HH:mm" className="text-slate-900">24-hour (HH:mm)</SelectItem>
                    <SelectItem value="HH:mm:ss" className="text-slate-900">24-hour with seconds (HH:mm:ss)</SelectItem>
                    <SelectItem value="hh:mm a" className="text-slate-900">12-hour (hh:mm AM/PM)</SelectItem>
                    <SelectItem value="hh:mm:ss a" className="text-slate-900">12-hour with seconds (hh:mm:ss AM/PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="first_day_of_week" className="text-slate-900">First Day of Week</Label>
              <Select 
                value={localeSettings.first_day_of_week.toString()} 
                onValueChange={(value) => setLocaleSettings(prev => ({ ...prev, first_day_of_week: parseInt(value) }))}
              >
                <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                  <SelectValue placeholder="Select first day" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="0" className="text-slate-900">Sunday</SelectItem>
                  <SelectItem value="1" className="text-slate-900">Monday</SelectItem>
                  <SelectItem value="2" className="text-slate-900">Tuesday</SelectItem>
                  <SelectItem value="3" className="text-slate-900">Wednesday</SelectItem>
                  <SelectItem value="4" className="text-slate-900">Thursday</SelectItem>
                  <SelectItem value="5" className="text-slate-900">Friday</SelectItem>
                  <SelectItem value="6" className="text-slate-900">Saturday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Restaurant Details */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <Building className="h-5 w-5 text-orange-600" />
              </div>
              Restaurant Details
            </CardTitle>
            <CardDescription className="text-slate-600">
              Update your restaurant's contact information and address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restaurant_name" className="text-slate-900">Restaurant Name</Label>
              <Input
                id="restaurant_name"
                value={localeSettings.restaurant_name}
                onChange={(e) => setLocaleSettings(prev => ({ ...prev, restaurant_name: e.target.value }))}
                placeholder="Dona Theresa"
                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="restaurant_phone" className="text-slate-900">Phone Number</Label>
              <Input
                id="restaurant_phone"
                value={localeSettings.restaurant_phone}
                onChange={(e) => setLocaleSettings(prev => ({ ...prev, restaurant_phone: e.target.value }))}
                placeholder="+44 20 8421 5550"
                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="restaurant_address" className="text-slate-900">Address</Label>
              <Input
                id="restaurant_address"
                value={localeSettings.restaurant_address}
                onChange={(e) => setLocaleSettings(prev => ({ ...prev, restaurant_address: e.target.value }))}
                placeholder="451 Uxbridge Road, Pinner"
                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="restaurant_city" className="text-slate-900">City</Label>
                <Input
                  id="restaurant_city"
                  value={localeSettings.restaurant_city}
                  onChange={(e) => setLocaleSettings(prev => ({ ...prev, restaurant_city: e.target.value }))}
                  placeholder="London"
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="restaurant_postal_code" className="text-slate-900">Postal Code</Label>
                <Input
                  id="restaurant_postal_code"
                  value={localeSettings.restaurant_postal_code}
                  onChange={(e) => setLocaleSettings(prev => ({ ...prev, restaurant_postal_code: e.target.value }))}
                  placeholder="HA5 1AA"
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  )
} 