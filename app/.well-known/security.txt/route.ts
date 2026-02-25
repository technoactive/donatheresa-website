import { NextResponse } from 'next/server'

// Security.txt - Industry standard for security vulnerability disclosure
// https://securitytxt.org/

export async function GET() {
  const securityTxt = `# Dona Theresa Restaurant - Security Policy
# https://securitytxt.org/

Contact: mailto:info@technoactive.co.uk
Expires: 2027-01-28T00:00:00.000Z
Preferred-Languages: en
Canonical: https://donatheresa.co.uk/.well-known/security.txt

# Security Policy
# We take security seriously. If you discover a vulnerability, 
# please report it to us responsibly.

# Scope
# This policy applies to the donatheresa.co.uk website.

# Out of Scope
# - Third-party services and integrations
# - Social media accounts
# - Physical security

# Disclosure Policy
# We ask that you:
# - Give us reasonable time to respond before public disclosure
# - Do not access or modify data belonging to others
# - Do not perform denial of service attacks
# - Do not send spam or social engineering attacks

# Acknowledgements
# We appreciate your efforts in keeping our customers safe.
`

  return new NextResponse(securityTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
