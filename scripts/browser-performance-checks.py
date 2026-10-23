from playwright.sync_api import sync_playwright
import json
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto("http://localhost:3100/login")
    page.wait_for_load_state("networkidle")
    print("INITIAL", json.dumps({"url": page.url, "lang": page.locator("html").get_attribute("lang"), "buttons": page.get_by_role("button").all_text_contents()}, ensure_ascii=False))
    assert page.locator("#email").is_visible()
    assert page.locator("#password").is_visible()
    page.screenshot(path="performance-login-desktop.png", full_page=True)
    page.evaluate("localStorage.setItem('automed-lang','en'); localStorage.setItem('automed-theme','dark')")
    page.reload()
    page.wait_for_load_state("networkidle")
    assert page.locator("html").get_attribute("lang") == "en"
    assert page.locator("html").get_attribute("dir") == "ltr"
    assert page.locator("html").get_attribute("data-theme") == "dark"
    assert page.get_by_role("button", name="Sign in", exact=True).is_visible()
    page.set_viewport_size({"width": 390, "height": 844})
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
    page.screenshot(path="performance-login-mobile.png", full_page=True)
    page.goto("http://localhost:3100/orders")
    page.wait_for_load_state("networkidle")
    assert "/login" in page.url
    print("PASS: login form, persisted English/dark preferences, RTL/LTR state, 390px viewport, unauthenticated orders redirect")
    print("PAGE_ERRORS", json.dumps(errors))
    assert not errors
    browser.close()
