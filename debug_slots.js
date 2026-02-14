// NATIVE JS IMPLEMENTATION (No Dependencies)

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

function isBefore(d1, d2) {
    return d1.getTime() < d2.getTime();
}

function isAfter(d1, d2) {
    return d1.getTime() > d2.getTime();
}

function formatTime(date) {
    // Returns HH:mm
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
}

// MOCK DATA matching Server Logs
const availabilitySlots = [
    {
        id: 'test-slot-uuid',
        organization_id: 'test-org-uuid',
        day_of_week: 6,
        start_time: '00:00:00',
        end_time: '24:00:00',
        is_available: true
    }
];

const config = {
    slotDuration: 15
};

// MOCK DATE: Feb 14 2026 (Saturday)
const dateStr = '2026-02-14T00:00:00';
const date = new Date(dateStr);

console.log('--- DEBUG START ---');
console.log('Date Input:', dateStr);
console.log('Date Object:', date.toString());
const dayOfWeek = date.getDay();
console.log('Day of Week:', dayOfWeek);

// 1. Filter Check
// Note: availabilitySlots uses number for day_of_week
const daySlots = availabilitySlots.filter(s => s.day_of_week === dayOfWeek);
console.log('Filtered Slots Length:', daySlots.length);

if (daySlots.length === 0) {
    console.log('FAIL: No slots found for this day.');
    console.log('Expected day:', dayOfWeek);
    console.log('Available days:', availabilitySlots.map(s => s.day_of_week));
    return; // Exit script
}

// 2. Logic Check
const generated = [];
const duration = config.slotDuration;

daySlots.forEach(slot => {
    // Parse start/end times (HH:MM:SS)
    const [startH, startM] = slot.start_time.split(':').map(Number);
    const [endH, endM] = slot.end_time.split(':').map(Number);

    console.log(`Processing Slot: ${startH}:${startM} to ${endH}:${endM}`);

    let current = new Date(date);
    current.setHours(startH, startM, 0, 0);

    const end = new Date(date);
    end.setHours(endH, endM, 0, 0);

    console.log(`Current Start: ${current.toString()}`);
    console.log(`End Limit: ${end.toString()}`);
    console.log(`Is Before? ${isBefore(current, end)}`);

    let loopCount = 0;
    while (isBefore(current, end)) {
        loopCount++;
        const slotEnd = addMinutes(current, duration);
        if (isAfter(slotEnd, end)) break;

        generated.push({
            time: formatTime(current),
            isBooked: false
        });

        current = addMinutes(current, duration);

        if (loopCount > 1000) {
            console.log('INFINITE LOOP DETECTED');
            break;
        }
    }
});

console.log(`Generated ${generated.length} slots.`);
if (generated.length > 0) {
    console.log('First 5:', generated.slice(0, 5));
    console.log('Last 5:', generated.slice(-5));
}
console.log('--- DEBUG END ---');
