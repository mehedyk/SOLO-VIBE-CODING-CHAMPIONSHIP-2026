"""Real-browser checks (Playwright + Chromium) against a running `next start`.
Usage: BASE=http://localhost:3100 python3 tests/e2e/ui_check.py
Prints one PASS/FAIL line per check; exits 1 if any FAIL."""
import os, sys, json
from playwright.sync_api import sync_playwright

BASE = os.environ.get("BASE", "http://localhost:3100")
SHOTS = os.environ.get("SHOTS", "assets/screenshots")
results = []
def check(name, cond, detail=""):
    results.append((name, bool(cond), detail))
    print(("PASS " if cond else "FAIL ") + name + (f"  [{detail}]" if detail and not cond else ""))

LESSON = "/bn/lessons/subtraction-regrouping"

with sync_playwright() as p:
    b = p.chromium.launch()

    # ---- routing, language, font
    ctx = b.new_context(viewport={"width": 1280, "height": 800})
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    fonts = []
    page.on("response", lambda r: fonts.append((r.url, r.status)) if "Kalpurush" in r.url else None)
    page.goto(BASE + "/")
    check("root redirects to /bn", page.url.rstrip("/").endswith("/bn"), page.url)
    check("html lang=bn by default", page.get_attribute("html", "lang") == "bn")
    check("Bangla app name rendered", "প্রাইমারি ভিজ্যুয়াল ল্যাব" in page.inner_text("h1"))
    page.wait_for_timeout(500)
    check("Kalpurush font file served 200", any(s == 200 for _, s in fonts), str(fonts))
    check("Kalpurush font loaded in document", page.evaluate("document.fonts.check('16px Kalpurush')"))
    check("body font-family starts with Kalpurush", page.evaluate("getComputedStyle(document.body).fontFamily").startswith('Kalpurush'))

    # ---- lesson flow 52-27 with prediction gate
    page.goto(BASE + LESSON)
    page.wait_for_selector("svg.board")
    check("lesson title (bn)", "হাতে নিয়ে বিয়োগ" in page.inner_text("h1"))
    check("demo/unreviewed badge visible", "পর্যালোচিত নয়" in page.inner_text(".badge"))
    vc = lambda: page.inner_text(".valuecheck")
    check("start step: value check shows 52 (bn digits)", "৫২" in vc() and "= ৫২" in vc(), vc())
    page.get_by_role("button", name="পরের ধাপ", exact=True).click()
    check("prediction gate appears before ones step", page.get_by_role("heading", name="আগে অনুমান করো").count() == 1)
    check("Next disabled while prediction open", page.get_by_role("button", name="পরের ধাপ", exact=True).is_disabled())
    page.get_by_role("button", name="হ্যাঁ, সরানো যাবে").click()  # wrong on purpose
    check("wrong prediction gets specific feedback", "এখনো নয়" in page.inner_text(".predict") and "২ < ৭" in page.inner_text(".predict"), page.inner_text(".predict"))
    page.get_by_role("button", name="পরের ধাপ দেখাও").click()
    check("exchange step note mentions total value unchanged", "মোট মান একই" in page.inner_text(".note"), page.inner_text(".note"))
    check("after exchange ones column = 12 (১২)", "১২" in page.text_content("svg.board"))
    seen_equal = [("= ৫২" in vc())]
    for _ in range(6):
        nxt = page.get_by_role("button", name="পরের ধাপ", exact=True)
        if nxt.is_disabled():
            if page.get_by_role("button", name="পরের ধাপ দেখাও").count():
                page.get_by_role("button", name="হ্যাঁ, সরানো যাবে").click() if page.get_by_role("button", name="হ্যাঁ, সরানো যাবে").count() else None
                page.get_by_role("button", name="পরের ধাপ দেখাও").click()
        else:
            nxt.click()
            if page.get_by_role("heading", name="আগে অনুমান করো").count():
                page.get_by_role("button", name="হ্যাঁ, সরানো যাবে").click()
                page.get_by_role("button", name="পরের ধাপ দেখাও").click()
        seen_equal.append("= ৫২" in vc())
    check("total value stays 52 at every visited step", all(seen_equal), str(seen_equal))
    check("final note shows 52 − 27 = 25 in Bangla digits", "৫২ − ২৭ = ২৫" in page.inner_text(".note"), page.inner_text(".note"))
    check("written method: 4 cells per row (aligned header and body)", page.evaluate("Array.from(document.querySelectorAll('table.written tr')).every(r => r.children.length === 4)"))
    check("written method answer digits shown at the end (২ and ৫)", all(ch in page.inner_text("table.written") for ch in ("২", "৫")) and "?" not in page.inner_text("table.written"), page.inner_text("table.written"))
    page.get_by_role("button", name="আবার শুরু").click()
    check("reset returns to step 1", "ধাপ ১ /" in page.inner_text(".stepno"), page.inner_text(".stepno"))
    page.get_by_role("button", name="পরের ধাপ", exact=True).click()
    page.get_by_role("button", name="আগের ধাপ").click()
    check("previous step button works and clears prediction", page.get_by_role("heading", name="আগে অনুমান করো").count() == 0 and "ধাপ ১ /" in page.inner_text(".stepno"))

    # ---- keyboard operation
    page.get_by_role("button", name="আবার শুরু").click()
    page.locator("body").click(position={"x": 5, "y": 5})
    page.get_by_role("button", name="আবার শুরু").focus()
    page.keyboard.press("ArrowRight")
    check("ArrowRight advances (opens prediction)", page.get_by_role("heading", name="আগে অনুমান করো").count() == 1)
    page.keyboard.press("Tab")
    focused = page.evaluate("document.activeElement && document.activeElement.tagName")
    check("Tab moves focus to a real control", focused in ("BUTTON", "A", "INPUT"), str(focused))
    page.get_by_role("button", name="না, আগে ভাঙতে হবে").focus()
    page.keyboard.press("Enter")
    check("prediction answerable by keyboard (Enter)", "ঠিক!" in page.inner_text(".predict"), page.inner_text(".predict"))
    # arrows ignored in input
    page.get_by_role("button", name="পরের ধাপ দেখাও").click()
    page.locator("#in-m").focus(); page.keyboard.press("ArrowLeft")
    check("arrow keys do not change steps while typing in an input", "ধাপ ২ /" in page.inner_text(".stepno"), page.inner_text(".stepno"))

    # ---- input validation + Bangla digits
    page.locator("#in-m").fill("20"); page.locator("#in-s").fill("30")
    check("subtrahend larger -> clear alert", "বড় হতে পারবে না" in page.inner_text("#hint-s") and page.get_attribute("#in-s", "aria-invalid") == "true")
    check("impossible state not drawn: board still shows previous valid lesson", "৫২" in vc(), vc())
    page.locator("#in-m").fill("1000"); page.locator("#in-s").fill("3")
    check("out of range message", "০ থেকে ৯৯৯" in page.inner_text("#hint-m") and page.get_attribute("#in-m", "aria-invalid") == "true", page.inner_text("#hint-m"))
    page.locator("#in-m").fill("2.5")
    check("decimal rejected, not guessed", "পূর্ণসংখ্যা" in page.inner_text("#hint-m"))
    page.locator("#in-m").fill("")
    check("empty input message", "ফাঁকা" in page.inner_text("#hint-m"))
    page.locator("#in-m").fill("৩০৫"); page.locator("#in-s").fill("১৬৮")
    page.wait_for_timeout(200)
    check("Bangla-digit input accepted (305-168)", "= ৩০৫" in vc(), vc())
    page.get_by_role("button", name="পরের ধাপ", exact=True).click(); page.get_by_role("button", name="না, আগে ভাঙতে হবে").click(); page.get_by_role("button", name="পরের ধাপ দেখাও").click()
    check("305-168 first exchange comes from hundreds (zero tens)", "শতক" in page.inner_text(".note") and "১০টি দশক" in page.inner_text(".note"), page.inner_text(".note"))

    # ---- practice feedback
    page.locator("#in-m").fill("52"); page.locator("#in-s").fill("27"); page.wait_for_timeout(200)
    g = page.locator(".card").first
    g.locator("input").fill("২৫"); g.get_by_role("button", name="মিলিয়ে দেখো").click()
    check("guided: Bangla digits answer accepted as correct", "সঠিক উত্তর" in g.inner_text(), g.inner_text())
    g.locator("input").fill("35"); g.get_by_role("button", name="মিলিয়ে দেখো").click()
    check("guided: 35 diagnosed as smaller-from-larger error", "ছোট সংখ্যাকে বড়" in g.inner_text(), g.inner_text())
    g.locator("input").fill("abc"); g.get_by_role("button", name="মিলিয়ে দেখো").click()
    check("guided: letters give input error not 'wrong'", "পূর্ণসংখ্যা" in g.inner_text(), g.inner_text())
    check("no mastery claim after correct answer; reminder shown", "পুরোপুরি শেখা নয়" in page.inner_text(".practice"))
    check("session stats labelled not saved", "সংরক্ষিত নয়" in page.inner_text(".practice"))

    # ---- text alternative
    page.get_by_role("button", name="লেখায় দেখুন").click()
    check("text mode shows ordered list, no svg board", page.locator("ol.textsteps li").count() >= 1 and page.locator("svg.board").count() == 0)
    page.get_by_role("button", name="ব্লকে দেখুন").click()
    check("board has accessible title/desc", page.locator("svg.board title").count() == 1 and "আছে" in page.locator("svg.board desc").text_content())
    check("no console/page errors on lesson", not errors, "; ".join(errors)[:300])
    ctx.close()

    # ---- reduced motion (OS-level)
    ctx = b.new_context(reduced_motion="reduce", viewport={"width": 1280, "height": 800}); pg = ctx.new_page()
    pg.goto(BASE + LESSON); pg.wait_for_selector("svg.board")
    pg.wait_for_timeout(200)
    check("OS reduced-motion -> data-motion=reduce", pg.get_attribute(".lab", "data-motion") == "reduce")
    pg.get_by_role("button", name="পরের ধাপ", exact=True).click(); pg.get_by_role("button", name="না, আগে ভাঙতে হবে").click(); pg.get_by_role("button", name="পরের ধাপ দেখাও").click()
    name = pg.evaluate("getComputedStyle(document.querySelector('.pop')).animationName")
    check("new blocks have no animation under reduced motion", name == "none", name)
    ctx.close()
    ctx = b.new_context(viewport={"width": 1280, "height": 800}); pg = ctx.new_page()
    pg.goto(BASE + LESSON); pg.wait_for_selector("svg.board")
    pg.get_by_role("button", name="কম নড়াচড়া").click()
    pg.get_by_role("button", name="পরের ধাপ", exact=True).click(); pg.get_by_role("button", name="না, আগে ভাঙতে হবে").click(); pg.get_by_role("button", name="পরের ধাপ দেখাও").click()
    name = pg.evaluate("getComputedStyle(document.querySelector('.pop')).animationName")
    check("manual 'reduce motion' toggle disables animation", pg.get_attribute(".lab", "data-motion") == "reduce" and name == "none", name)
    ctx.close()

    # ---- English route + switch
    ctx = b.new_context(viewport={"width": 1280, "height": 800}); pg = ctx.new_page()
    pg.goto(BASE + "/en/lessons/subtraction-regrouping"); pg.wait_for_selector("svg.board")
    check("English route lang=en", pg.get_attribute("html", "lang") == "en")
    check("English title", "Subtraction with regrouping" in pg.inner_text("h1"))
    check("English body font is not Kalpurush", "Kalpurush" not in pg.evaluate("getComputedStyle(document.body).fontFamily"))
    href = pg.get_attribute("a.lang-switch", "href")
    check("language switch keeps path, flips to bn", href == "/bn/lessons/subtraction-regrouping", href)
    pg.locator("#in-m").fill("52"); pg.locator("#in-s").fill("27")
    pg.get_by_role("button", name="Next step", exact=True).click()
    check("English prediction text", "Predict first" in pg.inner_text(".predict"))
    ctx.close()

    # ---- presenter mode + layouts
    sizes = {"projector-1920": (1920, 1080), "laptop-1366": (1366, 768), "tablet-768": (768, 1024), "phone-390": (390, 844), "phone-320": (320, 640)}
    for label, (w, h) in sizes.items():
        ctx = b.new_context(viewport={"width": w, "height": h}); pg = ctx.new_page()
        pg.goto(BASE + LESSON + "/present"); pg.wait_for_selector("svg.board")
        pg.get_by_role("button", name="পরের ধাপ", exact=True).click(); pg.get_by_role("button", name="অনুমান বাদ দিয়ে এগোও").click()
        sw = pg.evaluate("[document.documentElement.scrollWidth, window.innerWidth]")
        check(f"present {label}: no horizontal scroll", sw[0] <= sw[1] + 1, str(sw))
        box = pg.locator("svg.board").bounding_box()
        check(f"present {label}: board visible and sized", box and box["width"] >= 250 and box["height"] > 100, str(box))
        th = pg.locator(".col-title").first.bounding_box()
        check(f"present {label}: board text legible (>=12px rendered)", th and th["height"] >= 12, str(th))
        btn = pg.get_by_role("button", name="পরের ধাপ", exact=True).bounding_box()
        check(f"present {label}: Next button >=44px tall", btn and btn["height"] >= 44, str(btn))
        if label in ("projector-1920", "phone-390", "tablet-768"):
            pg.wait_for_timeout(800); pg.screenshot(path=f"{SHOTS}/present-{label}.png")
        ctx.close()
    ctx = b.new_context(viewport={"width": 1366, "height": 768}); pg = ctx.new_page()
    pg.goto(BASE + LESSON + "/present"); pg.wait_for_selector("svg.board")
    check("present: teacher notes hidden by default", pg.locator(".tnotes").count() == 0)
    pg.get_by_role("button", name="শিক্ষক-নোট দেখান").click()
    check("present: teacher notes can be shown", pg.locator(".tnotes").count() == 1)
    check("present: fullscreen control exists", pg.get_by_role("button", name="পূর্ণ পর্দা", exact=True).count() == 1)
    fs = float(pg.evaluate("getComputedStyle(document.querySelector('.controls button.primary')).fontSize").replace("px", ""))
    check("present: control font >= 20px (readable from the back)", fs >= 20, str(fs))
    check("present: no hover dependency (no :hover-only rules in CSS)", ":hover" not in pg.evaluate("Array.from(document.styleSheets).map(s=>Array.from(s.cssRules).map(r=>r.cssText).join('')).join('')"))
    ctx.close()
    # student layout shots
    for label, (w, h) in {"desktop": (1366, 900), "phone": (390, 844)}.items():
        ctx = b.new_context(viewport={"width": w, "height": h}); pg = ctx.new_page()
        pg.goto(BASE + LESSON); pg.wait_for_selector("svg.board")
        pg.get_by_role("button", name="পরের ধাপ", exact=True).click(); pg.get_by_role("button", name="না, আগে ভাঙতে হবে").click(); pg.get_by_role("button", name="পরের ধাপ দেখাও").click()
        sw = pg.evaluate("[document.documentElement.scrollWidth, window.innerWidth]")
        check(f"student {label}: no horizontal scroll with long Bangla labels", sw[0] <= sw[1] + 1, str(sw))
        pg.wait_for_timeout(800); pg.screenshot(path=f"{SHOTS}/student-{label}.png", full_page=(label == "phone"))
        ctx.close()

    # ---- unavailable media: font blocked
    ctx = b.new_context(viewport={"width": 1280, "height": 800}); pg = ctx.new_page()
    pg.route("**/fonts/*", lambda r: r.abort())
    perr = []; pg.on("pageerror", lambda e: perr.append(str(e)))
    pg.goto(BASE + LESSON); pg.wait_for_selector("svg.board")
    check("font blocked: page still renders Bangla text with fallback", "হাতে নিয়ে বিয়োগ" in pg.inner_text("h1") and not perr, str(perr))
    ctx.close()

    # ---- 404 for unknown language
    ctx = b.new_context(); pg = ctx.new_page()
    r = pg.goto(BASE + "/fr/lessons/subtraction-regrouping")
    check("unknown language returns 404", r.status == 404, str(r.status))
    ctx.close()
    b.close()

fails = [r for r in results if not r[1]]
print(f"\nSUMMARY: {len(results)-len(fails)}/{len(results)} passed, {len(fails)} failed")
json.dump([{"name": n, "pass": ok, "detail": d} for n, ok, d in results], open("tests/e2e/last-run.json", "w"), ensure_ascii=False, indent=1)
sys.exit(1 if fails else 0)
