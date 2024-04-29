function choosePlan(plan) {
    document.getElementById('free-plan-header').classList.remove('selected');
    document.getElementById('premium-plan-header').classList.remove('selected');
    document.getElementById(`${plan}-plan-header`).classList.add('selected');
    selectedPlan = plan;
};


function goNext() {
    if (selectedPlan === "free") {
        Swal.fire({
            title: "Gói miễn phí!",
            text: "Bạn có thể tận hưởng các tiện ích miễn phí của iFresh. Nâng cấp lên Gói cao cấp ngay để được tận hưởng tất cả những tính năng hay ho nhé!",
            icon: "success"
        });
    }
    else {
        window.location.href = '/plans/premium';
    }
};




document.addEventListener('DOMContentLoaded', function() {
    const planHeader = document.getElementById(`${userPlan}-plan-header`);
    planHeader.classList.add('selected');
});