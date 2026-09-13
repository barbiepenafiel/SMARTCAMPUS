(() => {
    const requirements = [
        { label: 'At least one uppercase letter (A–Z)', pattern: /[A-Z]/ },
        // Matches PASSWORD_REGEX in server/server.js and signup validation in auth.js.
        { label: 'At least one special character (@$!%*?&)', pattern: /[@$!%*?&]/ }
    ];

    document.querySelectorAll('[data-password-requirements]').forEach((input) => {
        const meter = document.createElement('div');
        meter.className = 'password-meter';
        meter.id = `${input.id}-meter`;
        const track = document.createElement('span');
        track.className = 'password-meter-track';
        track.setAttribute('aria-hidden', 'true');
        const fill = document.createElement('span');
        fill.className = 'password-meter-fill';
        track.append(fill);
        const rating = document.createElement('span');
        rating.className = 'password-meter-label';
        meter.append(track, rating);
        const checklist = document.createElement('ul');
        checklist.id = `${input.id}-requirements`;
        checklist.className = 'password-requirements';
        checklist.setAttribute('aria-live', 'polite');
        checklist.setAttribute('aria-atomic', 'true');
        const rows = requirements.map(({ label }) => {
            const row = document.createElement('li');
            const icon = document.createElement('span');
            icon.className = 'password-requirement-icon';
            icon.setAttribute('aria-hidden', 'true');
            const text = document.createElement('span');
            row.append(icon, text);
            checklist.append(row);
            return { row, icon, text, label };
        });
        (input.closest('.input-group') || input).after(meter, checklist);
        input.setAttribute('aria-describedby', [input.getAttribute('aria-describedby'), meter.id, checklist.id].filter(Boolean).join(' '));

        const update = () => {
            // Evaluate all existing signup rules; this display never blocks login.
            const checks = [/.{8,}/, /[a-z]/, /[A-Z]/, /\d/, /[@$!%*?&]/, /^[A-Za-z\d@$!%*?&]+$/];
            const score = input.value === '' ? 0 : checks.filter(pattern => pattern.test(input.value)).length;
            const level = !input.value ? 'neutral' : score === checks.length ? 'met' : score >= 4 ? 'partial' : 'unmet';
            meter.dataset.state = level;
            fill.style.width = `${score / checks.length * 100}%`;
            const label = !input.value ? 'Password requirements' : level === 'met' ? 'Requirements met' : level === 'partial' ? 'Almost there' : 'Needs improvement';
            if (rating.textContent !== label) rating.textContent = label;
            requirements.forEach(({ pattern }, index) => {
                const state = input.value === '' ? 'neutral' : pattern.test(input.value) ? 'met' : 'unmet';
                const { row, icon, text, label } = rows[index];
                if (row.dataset.state === state) return;
                row.dataset.state = state;
                icon.textContent = state === 'neutral' ? '○' : state === 'met' ? '✓' : '✕';
                text.textContent = `${label} — ${state === 'neutral' ? 'Required' : state === 'met' ? 'Met' : 'Not met'}`;
            });
        };
        input.addEventListener('input', update);
        input.addEventListener('change', update);
        input.form?.addEventListener('reset', () => setTimeout(update, 0));
        window.addEventListener('pageshow', update);
        update();
    });
})();
