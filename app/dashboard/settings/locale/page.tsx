'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Loader2, Globe, MapPin, Clock, DollarSign, Calendar, Phone, Building, RefreshCw, Save } from 'lucide-react'
import { getLocaleSettings, updateLocaleSettings } from './actions'
import { commonTimezones, commonCountries, commonLanguages } from '@/lib/locale-utils'
import { type LocaleSettings } from '@/lib/types'
import { SettingsLayout } from '@/components/dashboard/settings-layout'

export default function LocaleSettingsPage() {
  const [mounted, setMounted] = useState(false)
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
    setMounted(true)
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

  if (!mounted) return null

  if (isLoading) {
    return (
      <SettingsLayout
        title="Locale Settings"
        description="Configure location, timezone, currency and formatting preferences"
      >
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading settings...</p>
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
      <div className="grid gap-6">
        {/* Location & Timezone */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location & Timezone
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Configure your restaurant's location and timezone for accurate booking times
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium text-zinc-300">Country</Label>
                <Select value={localeSettings.country_code} onValueChange={handleCountryChange}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonCountries.map(country => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-sm font-medium text-zinc-300">Timezone</Label>
                <Select value={localeSettings.restaurant_timezone} onValueChange={handleTimezoneChange}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonTimezones.map(timezone => (
                      <SelectItem key={timezone.value} value={timezone.value}>
                        {timezone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-medium text-zinc-300">Language</Label>
              <Select 
                value={localeSettings.language_code} 
                onValueChange={(value) => setLocaleSettings(prev => ({ ...prev, language_code: value }))}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {commonLanguages.map(language => (
                    <SelectItem key={language.code} value={language.code}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Currency & Number Formatting */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Currency & Number Formatting
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Set currency and number formatting preferences for your locale
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency_code" className="text-sm font-medium text-zinc-300">Currency Code</Label>
                <Input
                  id="currency_code"
                  value={localeSettings.currency_code}
                  onChange={(e) => setLocaleSettings(prev => ({ ...prev, currency_code: e.target.value }))}
                  placeholder="GBP"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency_symbol" className="text-sm font-medium text-zinc-300">Currency Symbol</Label>
                <Input
                  id="currency_symbol"
                  value={localeSettings.currency_symbol}
                  onChange={(e) => setLocaleSettings(prev => ({ ...prev, currency_symbol: e.target.value }))}
                  placeholder="£"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency_decimal_places" className="text-sm font-medium text-zinc-300">Decimal Places</Label>
                <Select 
                  value={localeSettings.currency_decimal_places.toString()} 
                  onValueChange={(value) => setLocaleSettings(prev => ({ ...prev, currency_decimal_places: parseInt(value) }))}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Select decimal places" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="decimal_separator" className="text-sm font-medium text-zinc-300">Decimal Separator</Label>
                <Select 
                  value={localeSettings.decimal_separator} 
                  onValueChange={(value) => setLocaleSettings(prev => ({ ...prev, decimal_separator: value }))}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Select separator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=".">. (period)</SelectItem>
                    <SelectItem value=",">, (comma)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thousands_separator" className="text-sm font-medium text-zinc-300">Thousands Separator</Label>
                <Select 
                  value={localeSettings.thousands_separator} 
                  onValueChange={(value) => setLocaleSettings(prev => ({ ...prev, thousands_separator: value }))}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Select separator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=",">, (comma)</SelectItem>
                    <SelectItem value=".">. (period)</SelectItem>
                    <SelectItem value=" "> (space)</SelectItem>
                    <SelectItem value="'">′ (apostrophe)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date & Time Formatting */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Date & Time Formatting
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Configure how dates and times are displayed in your system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_format" className="text-sm font-medium text-zinc-300">Date Format</Label>
                <Select 
                  value={localeSettings.date_format} 
                  onValueChange={(value) => setLocaleSettings(prev => ({ ...prev, date_format: value }))}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/MM/yyyy">DD/MM/YYYY (UK)</SelectItem>
                    <SelectItem value="MM/dd/yyyy">MM/DD/YYYY (US)</SelectItem>
                    <SelectItem value="yyyy-MM-dd">YYYY-MM-DD (ISO)</SelectItem>
                    <SelectItem value="dd-MM-yyyy">DD-MM-YYYY</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time_format" className="text-sm font-medium text-zinc-300">Time Format</Label>
                <Select 
                  value={localeSettings.time_format} 
                  onValueChange={(value) => setLocaleSettings(prev => ({ ...prev, time_format: value }))}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Select time format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HH:mm">24-hour (HH:mm)</SelectItem>
                    <SelectItem value="HH:mm:ss">24-hour with seconds (HH:mm:ss)</SelectItem>
                    <SelectItem value="hh:mm a">12-hour (hh:mm AM/PM)</SelectItem>
                    <SelectItem value="hh:mm:ss a">12-hour with seconds (hh:mm:ss AM/PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="first_day_of_week" className="text-sm font-medium text-zinc-300">First Day of Week</Label>
              <Select 
                value={localeSettings.first_day_of_week.toString()} 
                onValueChange={(value) => setLocaleSettings(prev => ({ ...prev, first_day_of_week: parseInt(value) }))}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Select first day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sunday</SelectItem>
                  <SelectItem value="1">Monday</SelectItem>
                  <SelectItem value="2">Tuesday</SelectItem>
                  <SelectItem value="3">Wednesday</SelectItem>
                  <SelectItem value="4">Thursday</SelectItem>
                  <SelectItem value="5">Friday</SelectItem>
                  <SelectItem value="6">Saturday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Restaurant Details */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-2">
              <Building className="h-5 w-5" />
              Restaurant Details
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Update your restaurant's contact information and address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restaurant_name" className="text-sm font-medium text-zinc-300">Restaurant Name</Label>
              <Input
                id="restaurant_name"
                value={localeSettings.restaurant_name}
                onChange={(e) => setLocaleSettings(prev => ({ ...prev, restaurant_name: e.target.value }))}
                placeholder="Dona Theresa"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="restaurant_phone" className="text-sm font-medium text-zinc-300">Phone Number</Label>
              <Input
                id="restaurant_phone"
                value={localeSettings.restaurant_phone}
                onChange={(e) => setLocaleSettings(prev => ({ ...prev, restaurant_phone: e.target.value }))}
                placeholder="+44 20 8421 5550"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="restaurant_address" className="text-sm font-medium text-zinc-300">Address</Label>
              <Input
                id="restaurant_address"
                value={localeSettings.restaurant_address}
                onChange={(e) => setLocaleSettings(prev => ({ ...prev, restaurant_address: e.target.value }))}
                placeholder="451 Uxbridge Road, Pinner"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="restaurant_city" className="text-sm font-medium text-zinc-300">City</Label>
                <Input
                  id="restaurant_city"
                  value={localeSettings.restaurant_city}
                  onChange={(e) => setLocaleSettings(prev => ({ ...prev, restaurant_city: e.target.value }))}
                  placeholder="London"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="restaurant_postal_code" className="text-sm font-medium text-zinc-300">Postal Code</Label>
                <Input
                  id="restaurant_postal_code"
                  value={localeSettings.restaurant_postal_code}
                  onChange={(e) => setLocaleSettings(prev => ({ ...prev, restaurant_postal_code: e.target.value }))}
                  placeholder="HA5 1AA"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  )
} 